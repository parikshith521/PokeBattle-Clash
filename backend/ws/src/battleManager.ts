import { WebSocket } from "ws";
import { DAMAGE_DONE, DEAL_DAMAGE, INIT_GAME } from "./keys";
import { Battle } from "./battle";


export class BattleManager {
    private battles: Battle[];
    private pendingUser: WebSocket | null;
    private pendingUserName: string;
    private pendingUserPokemon: any;
    private users: WebSocket[];

    constructor() {
        this.battles = [];
        this.pendingUser = null;
        this.users = [];
        this.pendingUserName = "";
        this.pendingUserPokemon = null;
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter((user) => user !== socket)
    }

    
    private addHandler(socket: WebSocket) {

        //setup to deal with messages sent by players
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if(message.type === INIT_GAME) {
                if(this.pendingUser){
                    const player2Name = message.payload.playerName;
                   const player2Pokemon = message.payload.playerPokemon;
                  
                    const battle = new Battle(this.pendingUser, socket, this.pendingUserPokemon, player2Pokemon, this.pendingUserName, player2Name);
                    this.battles.push(battle);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                    this.pendingUserName = message.payload.playerName;
                    this.pendingUserPokemon = message.payload.playerPokemon;
                }

                return;
            }

            

            //we alr know the battle, so p1,p2,poke1, poke2 is known, we just need name of attack, we need the damage amount and who is attacking,
            //the attacking player is the current socket, so we just find the other socket
            /*
                the current hp of the pokemon info is present in the battle class itself so this info is not needed
                message {
                    type: deal_damage
                    payload: {
                        attack name: string,
                        damage: number
                    }
                }
            */
            if(message.type === DEAL_DAMAGE) {

                const battle = this.battles.find((battle)=> battle.player1===socket || battle.player2 === socket);

                if(battle) {
                    battle.handleDamage(socket, message.payload);
                }

                return;

            }

            /* 
                just need to send a notification to the player who sent this messgae that he can attack
                message: {
                    type: damage done
                }
                we can identify the defending player (the player who sent this message) by the socket itself

            */

            if( message.type === DAMAGE_DONE ) {
                
                const battle = this.battles.find((battle) => battle.player1 === socket || battle.player2 === socket );

                if(battle) {
                    battle.handleDamageDone(socket, message.payload);
                }

                return;

            }

            
            
        })
    }

}