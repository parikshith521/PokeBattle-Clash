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
            
            <div>

                <div>PokéBattle</div>

            
                    {prop.user && <div>
                        
                    <p>{prop.user.username}</p>

                    <button onClick={()=>{
                            navigate('/store');
                        }}>STORE</button>
                        <button onClick={()=>{
                            localStorage.removeItem('user');
                            prop.setUser(null);
                        }}>LOGOUT</button>
                        </div>}
                    
            

        
                    {!prop.user && <div>
                        <button onClick={()=>{
                            navigate('/login');
                        }}>LOGIN</button>

                        <button onClick={()=>{
                            navigate('/signup')
                        }}>SIGN UP</button></div> }

            </div>

            {prop.user && <div>
                
                <button onClick={()=>{
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
                
                <div>
                    {userPokemon.map((poke: any)=>(
                        <div>
                            <div><img src={`../assets/pokemon/${poke.name}.png`}/></div>
                            <div>{poke.name}</div>
                            <div>{poke.hp} HP</div>
                            <div>
                                {poke.moves.map((move: any)=>(
                                    <div>
                                        <p>{move.name } </p>
                                        <p> {move.damage} </p>
                                    </div>

                                ))}

                            </div>
                            <button onClick={()=>{
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