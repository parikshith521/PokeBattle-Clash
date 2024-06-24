"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = void 0;
const keys_1 = require("./keys");
class Battle {
    constructor(player1, player2, player1Pokemon, player2Pokemon, player1Name, player2Name) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.player1Pokemon = player1Pokemon;
        this.player2Pokemon = player2Pokemon;
        this.player1ScreenUpdated = false;
        this.player2ScreenUpdated = false;
        this.player2.send(JSON.stringify({
            type: keys_1.INIT_GAME,
            payload: {
                opponentPokemon: player1Pokemon,
                attackerName: player1Name
            }
        }));
        this.player1.send(JSON.stringify({
            type: keys_1.CHOOSE_ATTACK
        }));
    }
    //make moev
    handleDamage(attackingPlayer, payload) {
        const attackingPokemon = (this.player1 == attackingPlayer) ? this.player1Pokemon : this.player2Pokemon;
        const defendingPokemon = (this.player1Pokemon == attackingPokemon) ? this.player2Pokemon : this.player1Pokemon;
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
        if (defendingPokemon.hp - damage <= 0) {
            //defending pokemon faints
            const winningPlayer = (this.player1 == attackingPlayer) ? this.player1Name : this.player2Name;
            this.player1.send(JSON.stringify({
                type: keys_1.END_GAME,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}! Foe ${defendingPokemon.name} fainted!\n`,
                    winner: winningPlayer
                }
            }));
            this.player2.send(JSON.stringify({
                type: keys_1.END_GAME,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}! Foe ${defendingPokemon.name} fainted!\n`,
                    winner: winningPlayer
                }
            }));
        }
        else {
            const attackingPlayerName = (attackingPlayer == this.player1) ? this.player1Name : this.player2Name;
            //defending pokemon doesn't faint
            let currhp = 0;
            if (defendingPokemon == this.player2Pokemon) {
                this.player2Pokemon.hp -= damage;
                currhp = this.player2Pokemon.hp;
            }
            else {
                this.player1Pokemon.hp -= damage;
                currhp = this.player1Pokemon.hp;
            }
            //send message to both players notifying the frontend to updat the scene
            this.player1.send(JSON.stringify({
                type: keys_1.UPDATE_DAMAGE,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}!`,
                    hp: currhp,
                    attackerName: attackingPlayerName
                }
            }));
            this.player2.send(JSON.stringify({
                type: keys_1.UPDATE_DAMAGE,
                payload: {
                    text: `${attackingPokemon.name} used ${attackName}!`,
                    hp: currhp,
                    attackerName: attackingPlayerName
                }
            }));
        }
    }
    handleDamageDone(socket, payload) {
        if (socket === this.player1)
            this.player1ScreenUpdated = true;
        else
            this.player2ScreenUpdated = true;
        if (this.player2ScreenUpdated && this.player1ScreenUpdated) {
            this.player2ScreenUpdated = false;
            this.player1ScreenUpdated = false;
            if (payload.attackerName === this.player1Name) {
                this.player2.send(JSON.stringify({
                    type: keys_1.CHOOSE_ATTACK
                }));
            }
            else {
                this.player1.send(JSON.stringify({
                    type: keys_1.CHOOSE_ATTACK
                }));
            }
        }
    }
}
exports.Battle = Battle;
