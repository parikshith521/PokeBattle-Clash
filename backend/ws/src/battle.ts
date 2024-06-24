import { WebSocket } from "ws";
import { CHOOSE_ATTACK, END_GAME, INIT_GAME, UPDATE_DAMAGE } from "./keys";

export class Battle {
    public player1: WebSocket;
    public player2: WebSocket;
    public player1Name: string;
    public player2Name: string;
    public player1Pokemon: any;
    public player2Pokemon: any;
    public player1ScreenUpdated: boolean;
    public player2ScreenUpdated: boolean;


    constructor(player1: WebSocket, player2: WebSocket, player1Pokemon: any, player2Pokemon: any, player1Name: string, player2Name: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.player1Pokemon = player1Pokemon;
        this.player2Pokemon = player2Pokemon;
        this.player1ScreenUpdated = false;
        this.player2ScreenUpdated = false;


        
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                opponentPokemon: player1Pokemon,
                attackerName: player1Name
            }
        }))
        this.player1.send(JSON.stringify({
            type: CHOOSE_ATTACK
        }))
    }

    //make moev

    handleDamage(attackingPlayer: WebSocket, payload: {attack: string, damage: number})
    {
        const attackingPokemon = (this.player1==attackingPlayer)?this.player1Pokemon : this.player2Pokemon;
        const defendingPokemon = (this.player1Pokemon==attackingPokemon)?this.player2Pokemon: this.player1Pokemon;

        const damage = payload.damage;
        const attackName = payload.attack;

        /* 
            check if defending pokemon faints, if it does {
                send a message saying defending pokemon fainted and announce the winning player
            }
            if it doesn't faint {
                update the new hp of the defending pokemon to the frontend, and include the standard message like 
                attackig pokemon used water gun or smn
            }
        */
        
        if(defendingPokemon.hp - damage <= 0) {
            //defending pokemon faints
            const winningPlayer = (this.player1==attackingPlayer)?this.player1Name:this.player2Name;

            this.player1.send(JSON.stringify({
                type: END_GAME,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}! Foe ${defendingPokemon.name} fainted!\n`,
                    winner: winningPlayer
                }
            }));

            this.player2.send(JSON.stringify({
                type: END_GAME,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}! Foe ${defendingPokemon.name} fainted!\n`,
                    winner: winningPlayer
                }
            }));
        }
        else {
            const attackingPlayerName = (attackingPlayer==this.player1)?this.player1Name:this.player2Name;
            //defending pokemon doesn't faint
            let currhp = 0;
            if(defendingPokemon==this.player2Pokemon) {
                this.player2Pokemon.hp -= damage;
                currhp = this.player2Pokemon.hp;
            }
            else {
                this.player1Pokemon.hp -= damage;
                currhp = this.player1Pokemon.hp;
            }

            //send message to both players notifying the frontend to updat the scene
            this.player1.send(JSON.stringify({
                type: UPDATE_DAMAGE,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}!`,
                    hp: currhp,
                    attackerName: attackingPlayerName
                }
                
            }))

            this.player2.send(JSON.stringify({
                type: UPDATE_DAMAGE,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}!`,
                    hp: currhp,
                    attackerName: attackingPlayerName
                }
                
            }))

        }
    }

    handleDamageDone(socket: WebSocket, payload: {attackerName: string}) {
        if(socket===this.player1) this.player1ScreenUpdated = true;
        else this.player2ScreenUpdated = true;
        if(this.player2ScreenUpdated && this.player1ScreenUpdated) {
            this.player2ScreenUpdated = false;
            this.player1ScreenUpdated = false;
            if(payload.attackerName===this.player1Name) {
                this.player2.send(JSON.stringify({
                    type: CHOOSE_ATTACK
                }))
            }
            else {
                this.player1.send(JSON.stringify({
                    type: CHOOSE_ATTACK
                }))
            }
        }
    }


}