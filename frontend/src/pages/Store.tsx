import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Store = (prop: any) => {
   
    const [userMoney, setUserMoney] = useState<number>(0);
    const [userPokemon, setUserPokemon] = useState<any>(null);
    const [buyPokemon, setBuyPokemon] = useState<any>(null);

    const navigate = useNavigate();
    useEffect(()=>{

    },[])

    useEffect(()=>{
        if(!prop || !prop.user) return;
        console.log("TOP OF USEEFFECT");
        const getData = async () =>{

            const response = await fetch('http://localhost:8000/api/money/' + prop.user.username, {
                headers: {
                    'Authorization': `Bearer ${prop.user.token}`
                }
            });

            const data: {money: number} = await response.json();

            if(response.ok) {
                setUserMoney(data.money);
            }



            const response1 = await fetch('http://localhost:8000/api/pokemons/' + prop.user.username, {
                headers: {
                    'Authorization': `Bearer ${prop.user.token}`
                }
            })
            const data1 = await response1.json();
            if(response1.ok) {
                setUserPokemon(data1.userpokemons)
            }
            console.log(data1);
        
       
            const response2 = await fetch('http://localhost:8000/api/pokemons', {
                headers: {
                    'Authorization': `Bearer ${prop.user.token}`
                }
            })
            const data2 = await response2.json();
            if(response2.ok) {
                console.log(data2);
                setBuyPokemon(  data2.pokemons.filter((poke:any)=>!data1.userpokemons.some((item:any)=>item.id===poke.id))) ;
                console.log("FILTER RAN");
                console.log(buyPokemon);
                console.log(data2);
            }
            
            
        }
        getData();
        console.log("BUY POKE RAN");
        
       

    },[prop])

    

    return ( 
        <div>

            <div>
                <div>PokéBattle</div>
                {prop.user && <div>
                        
                        <p>{prop.user.username}</p>
                        <button onClick={()=>{
                                navigate('/');
                            }}>HOME</button>
                            <button onClick={()=>{
                                localStorage.removeItem('user');
                                prop.setUser(null);
                            }}>LOGOUT</button>
                            </div>}
            </div>
           

            <div>
                    <p>Store</p>
            </div>

             <div>
                Current Money:  $ {userMoney}  
             </div>

            <div>
            {buyPokemon && buyPokemon.map((poke:any)=>(
                <div>
                    <div><img src={`../assets/pokemon/${poke.name}.png`}/></div>
                    <div>{poke.name}</div>
                    <div> {poke.hp} HP</div>
                    <div>$ {poke.cost}</div>
                    <div>
                        {poke.moves.map((move:any)=>(
                            <div>
                                <p>{move.name}</p>
                                <p>{move.damage}</p>
                            </div>
                        ))}

                    </div>
                    <button disabled={poke.cost > userMoney} onClick={async ()=>{
                        console.log(poke);
                        const res = await fetch('http://localhost:8000/api/money/'+prop.user.username,{
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${prop.user.token}`
                            },
                            body: JSON.stringify({
                                money: -poke.cost
                            })
                        })
                        if(res.ok) {
                            setUserMoney(userMoney - poke.cost);
                        }
                        

                        const res1 = await fetch('http://localhost:8000/api/addpokemon/' + prop.user.username,{
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${prop.user.token}`
                            },
                            body: JSON.stringify({
                                userid: prop.user.userid,
                                pokemonId: poke.id
                            })
                        })
                        if(res1.ok){
                            setBuyPokemon(buyPokemon.filter((item:any)=>item.id!=poke.id));
                        }
                    
                        

                    }}>
                        BUY
                    </button>
                </div>
            ))}
            </div>

        </div>
     );
}
 
export default Store;