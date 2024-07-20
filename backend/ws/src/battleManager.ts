import { WebSocket } from "ws";
import { DAMAGE_DONE, DEAL_DAMAGE, INIT_GAME } from "./keys";
import { Battle } from "./battle";


export class BattleManager {
	private battles: Battle[];
	private pendingUser: WebSocket | null;
	private pendingUserName: string;
	private pendingUserPokemon: any;

	constructor() {
		this.battles = [];
		this.pendingUser = null;
		this.pendingUserName = "";
		this.pendingUserPokemon = null;
	}

	addUser(socket: WebSocket) {
		this.addHandler(socket);
	}

	removeUser(socket: WebSocket) {
		const battle = this.battles.find((battle)=> battle.player1===socket || battle.player2 === socket);
		if(battle) {
            battle.handleDisconnection(socket);
            this.battles = this.battles.filter((bat)=> bat!==battle);
        }
	}


	private addHandler(socket: WebSocket) {

		//setup to deal with messages sent by players
		socket.on("message", (data) => {
			const message = JSON.parse(data.toString());

			if (message.type === INIT_GAME) {

				//check if tihs user is already engaged in battle
				const btl = this.battles.find((battle) => battle.player1Name === message.payload.playerName || battle.player2Name === message.payload.playerName);
				if (btl) {
					socket.send(JSON.stringify({
						type: 'REPEAT'
					}))
					socket.close();
					return;
				}

				//this player could be the pending user themselves
				if (this.pendingUser) {
					const player2Name = message.payload.playerName;
					const player2Pokemon = message.payload.playerPokemon;

					// a valid pair
					if (player2Name != this.pendingUserName) {
						const battle = new Battle(this.pendingUser, socket, this.pendingUserPokemon, player2Pokemon, this.pendingUserName, player2Name);
						this.battles.push(battle);
						this.pendingUser = null;
					}
					else {
						//this user is actually the pending user
						//replace this user with the pending user and close the pending user connection with REPEAT
						this.pendingUser.send(JSON.stringify({
							type: 'REPEAT'
						}))
						this.pendingUser.close();
						this.pendingUser = socket;
						this.pendingUserName = message.payload.playerName;
						this.pendingUserPokemon = message.payload.playerPokemon;
					}
				}
				else {
					this.pendingUser = socket;
					this.pendingUserName = message.payload.playerName;
					this.pendingUserPokemon = message.payload.playerPokemon;
					
				}

				return;
			}

			if (message.type === DEAL_DAMAGE) {

				const battle = this.battles.find((battle) => battle.player1 === socket || battle.player2 === socket);

				if (battle) {
					battle.handleDamage(socket, message.payload);
				}

				return;

			}

			if (message.type === DAMAGE_DONE) {

				const battle = this.battles.find((battle) => battle.player1 === socket || battle.player2 === socket);

				if (battle) {
					battle.handleDamageDone(socket, message.payload);
				}

				return;

			}

		})
	}

}