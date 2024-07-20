import { useEffect, useState } from "react";
import SimBattle from "../components/SimBattle";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from 'react-router-dom';

 const INIT_GAME = "INIT_GAME";
 const CHOOSE_ATTACK = "CHOOSE_ATTACK";
 const DEAL_DAMAGE = "DEAL_DAMAGE";
 const END_GAME = "END_GAME";
 const UPDATE_DAMAGE = "UPDATE_DAMAGE";
 const DAMAGE_DONE = "DAMAGE_DONE";

 import { useLocation } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const state = location.state  as { 
        playerName: string,
        playerPokemon: {
            name: string,
            hp: number,
            moves: [
                {name: string, damage: number},
                {name: string, damage: number},
                {name: string, damage: number},
                {name: string, damage: number}
            ]
        }
    }
    
    useEffect(()=>{
        if(!state || !state.playerName || !state.playerPokemon) {
            navigate('/');
        }

    },[state,navigate])

    if(!state || (!state.playerName && !state.playerPokemon)) {
        return (<div>wapofia</div>)
    }

    const playerName = state.playerName;
    const playerPokemon = state.playerPokemon



    const [myHP, setMyHP] = useState(0);
    const [oppHP, setOppHP] = useState(0);
    const [myPokemonName, setMyPokemonName] = useState("");
    const [myOppPokemonName, setOppPokemonName] = useState("");

    const moves = playerPokemon.moves;

    const [text,setText] = useState("");

    const socket = useSocket();

    const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

  

    const wait2Seconds = async (isWinner: boolean) => {
        console.log("BOOLEAN VALUE: ");
        console.log(isWinner);
        let inc = 0;
        if(isWinner){
            inc = 10;
        }
        else inc = 1;
        console.log(inc);
        const token = (JSON.parse(localStorage.getItem('user')!)).token;
        console.log(playerName);
        const res = await fetch('http://localhost:8000/api/money/'+playerName,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                money: inc
            })
        })
        if(!res.ok) console.log("COULDNT UPDATE MONEY");
        await delay(10000); 
        navigate('/');
        console.log("WAITINGG");
      };
      

    useEffect(()=>{
        if(!state.playerName) return;
        console.log(playerName);
        console.log(playerPokemon);
        if(!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            console.log(message);
            console.log("MEEAGE RECEIVED");
            console.log(message.type);
            switch (message.type)
            {
                case INIT_GAME:
                    {
                       const opponentPokemon = message.payload.opponentPokemon;
                       const attackerName = message.payload.attackerName;
                       console.log("GAME INITIATED: ");
                       console.log(opponentPokemon);
                       console.log(playerPokemon);
                       setOppHP(opponentPokemon.hp);
                       setMyHP(playerPokemon.hp);
                       setMyPokemonName(playerPokemon.name);
                       setOppPokemonName(opponentPokemon.name);
                       if(attackerName===playerName) {
                        setText("Choose an attack!");
                       }
                       else setText("Waiting for opponent..."); 
                       break;
                    }
                    
                case CHOOSE_ATTACK:
                    {
                        setText("Choose an attack!");
                        break;
                    }
                case UPDATE_DAMAGE:
                    {
                        const attackerName = message.payload.attackerName;
                        const currhp = message.payload.hp;
                        if(attackerName===playerName) {
                            setText(message.payload.text);
                            setOppHP(currhp);
                        }
                        else {
                            setText('Foe ' + message.payload.text);
                            setMyHP(currhp);
                        }
                        socket.send(JSON.stringify({
                            type: DAMAGE_DONE,
                            payload: {
                                attackerName
                            }
                        }))
                        //wait2Seconds();
                        break;
                    }
                case END_GAME:
                    {
                        console.log("ENDGAME MSG RECEVIED");
                        console.log(message.payload);
                        const currText = (playerName===message.payload.winner)?message.payload.text + "You Won!":message.payload.text + "The Opponent Won!";
                        setText(currText);
                        if(playerName===message.payload.winner) {
                            setOppHP(0);
                        }
                        else {
                            setMyHP(0);
                        }
                        wait2Seconds(playerName===message.payload.winner);
                        
                        break;
                    }
                case 'DISCONNECT':
                    {
                        console.log("DISCONNECT MESG RECEIVED");
                        socket.close();
                        navigate('/');
                        break;
                    }
                case 'REPEAT':
                    {
                        console.log("REPEATED CONNECTION");
                        socket.close();
                        navigate('/');
                        break;
                    }
                default:
                    break;
            }
        }

    },[socket,state])


    return ( 
        <>
        {!socket && <div>Connecting......</div>}
       { socket && <div className="flex flex-col items-center ">
           
           {/* canvas  */}
            <div className='h-[75vh] w-screen flex justify-center'>
                
               <SimBattle hp={myHP} opphp = {oppHP} myPokeName={myPokemonName} oppPokeName={myOppPokemonName} />
            </div>

            {/* start game button */}
            <div className="flex justify-center my-5">
               { text === ""?
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={()=>{
                        socket.send(JSON.stringify({
                            type: INIT_GAME,
                            payload: {
                                playerName,
                                playerPokemon
                            }
                        }))
                        setText("Searching for opponent...");
                        console.log(text);
                    }}> <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-bungee">Start</span></button>
                :<div></div>}
            </div>

            {/* text box */}    

            <div className="w-[75%] font-poppins bg-slate-600 rounded border border-purple-600 p-4">
                {text}
            </div>

            {/* move set appears below */}
            <div className="flex flex-wrap p-3">
                {
                    moves.map((move)=>(
                    <button className="bg-violet-600 m-3 text-black btn glass hover:text-white" disabled={text!="Choose an attack!"} onClick={()=>{
                            socket.send(JSON.stringify({
                                type: DEAL_DAMAGE,
                                payload: {
                                    attack: move.name,
                                    damage: move.damage
                                }
                            }));
                            setText("");
                        }
                    }> <div><p>{move.name}</p> <p>{move.damage}</p></div></button>
                )
            
                )}
            </div>
        </div>}
        </>
     );
}
 
export default Game;