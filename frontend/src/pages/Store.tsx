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

    },[prop])

    

    return ( 
        <div className="flex flex-col justify-center items-center">

            <div className="w-full flex justify-around content-around py-10"> 
                <div className="font-bungee text-orange-500 text-4xl">PokéBattle</div>
                {prop.user && <div className="flex justify-center items-center">
                        
                        <p className="font-poppins font-medium text-lg text-or mx-3">{prop.user.username}</p>
                        <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                                navigate('/');
                            }}>HOME</button>
                            <button className=" mx-3 hover:text-white hover:bg-purple-600   bg-white text-black font-bungee px-4 py-1.5 font-bold" onClick={()=>{
                                localStorage.removeItem('user');
                                prop.setUser(null);
                            }}>LOGOUT</button>
                            </div>}
            </div>
           

            <div className="my-10 bg-green-500 text-black font-bungee p-3 text-5xl" >
                <p>Store</p>
            </div>

            <div className="m-5">
                Current Money: <span className="font-poppins text-green-400"> $ {userMoney} </span> 
            </div>

            <div className="flex flex-wrap mx-5 justify-center">
            {buyPokemon && buyPokemon.map((poke:any)=>(
                <div className="mx-20 my-5 font-poppins flex flex-col justify-center items-center border-[1px] border-solid border-gray-100 p-5">
                    <div><img className="w-52 m-3 mb-5" src={`../assets/pokemon/${poke.name}.png`}/></div>
                    <div className="text-2xl">{poke.name}</div>
                    <div className="text-lg text-green-400 font-medium"> {poke.hp} HP</div>
                    <div className="text-lg font-medium">$ {poke.cost}</div>
                    <div>
                        {poke.moves.map((move:any)=>(
                            <div className="flex justify-between w-[100%] text-base">
                                <p className="mx-3 text-left">{move.name}</p>
                                <p className="mx-3 text-right">{move.damage}</p>
                            </div>
                        ))}

                    </div>
                    <button className="hover:bg-purple-500 hover:cursor-pointer hover:text-white bg-slate-300 text-black py-1 px-2 my-1" disabled={poke.cost > userMoney} onClick={async ()=>{
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