import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




const Home = (prop: any) => {

    const [userPokemon, setUserPokemon] = useState([]);
    
    useEffect(()=>{
        const getData = async () =>{
            if(!prop.user) return;
            const response = await fetch('http://localhost:8000/api/pokemons/' + prop.user.username,{
                headers: {
                    'Authorization': `Bearer ${prop.user.token}`
                }
            } );
            const data = await response.json();
            console.log(data);
            if(response.ok) {
                setUserPokemon(data.userpokemons);
            }
            
        }
        getData();
    },[prop])
    

    //const f = prop.updateUserConext;
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState({
        name: '',
        hp: 0
    });
    const [moves, setMoves] = useState<any>([])
    return ( 
        <div>
            
            <div className="w-full flex justify-around content-around py-10">

                <div className="font-bungee text-orange-500 text-4xl">PokéBattle</div>

            
                    {prop.user && <div className="flex justify-center items-center">
                        
                    <p className="font-poppins font-medium text-lg text-or mx-3">{prop.user.username}</p>

                    <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                            navigate('/store');
                        }}>STORE</button>
                        <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                            localStorage.removeItem('user');
                            prop.setUser(null);
                        }}>LOGOUT</button>
                        </div>}
        
                    {!prop.user && <div>
                        <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                            navigate('/login');
                        }}>LOGIN</button>

                        <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                            navigate('/signup')
                        }}>SIGN UP</button></div> }

            </div>

            {prop.user && <div className=" flex flex-col justify-center items-center">
                
                <button className="my-10 hover:cursor-pointer bg-green-500 text-black font-bungee p-3 text-5xl" onClick={()=>{
                    if(pokemon.name.length && pokemon.hp) {
                        const data = {
                            playerName: prop.user.username,
                            playerPokemon: {
                                name: pokemon.name,
                                hp: pokemon.hp,
                                moves
                            }
                        }
                        navigate('/arena', {state: data})
                    }
                }} disabled={!pokemon.name.length && !pokemon.hp}>
                    <p>Enter Arena</p>
                </button>
                
                <div className="flex flex-wrap justify-center my-5">
                    {userPokemon.map((poke: any)=>(
                        <div className="m-2 font-poppins flex flex-col justify-center items-center border-[1px] border-solid border-gray-100 p-5">
                            <div><img className="w-52 m-3 mb-5" src={`../assets/pokemon/${poke.name}.png`}/></div>
                            <div className="text-2xl">{poke.name}</div>
                            <div className="text-lg text-green-400 font-medium">{poke.hp} HP</div>
                            <div className="p-2 flex flex-col items-center w-[100%]">
                                {poke.moves.map((move: any)=>(
                                    <div className="flex justify-between w-[100%] text-base">
                                        <p className=" text-left">{move.name } </p>
                                        <p className="text-right"> {move.damage} </p>
                                    </div>

                                ))}

                            </div>
                            <button className="hover:bg-purple-500 hover:cursor-pointer hover:text-white bg-slate-300 text-black py-1 px-2" onClick={()=>{
                                setPokemon({
                                    name: poke.name,
                                    hp: poke.hp
                                });
                                setMoves([
                                    {
                                        name: poke.moves[0].name,
                                        damage: poke.moves[0].damage
                                    },
                                    {
                                        name: poke.moves[1].name,
                                        damage: poke.moves[1].damage
                                    },
                                    {
                                        name: poke.moves[2].name,
                                        damage: poke.moves[2].damage
                                    },
                                    {
                                        name: poke.moves[3].name,
                                        damage: poke.moves[3].damage
                                    }
                                ]);
                                
                            }}>Select</button>
                        </div>
                    ))}

                </div>
                
                
                
                
            </div>}



        </div>
     );
}
 
export default Home;