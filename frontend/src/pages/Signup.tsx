
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (prop: any) => {


    const navigate = useNavigate();
    const f = prop.updateUserContext;


    useEffect(()=>{

        if(prop.user) {
            navigate('/');
        }

    },[prop.user])

    const [username, setUsernmae] = useState('');
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [pokemonName, setPokeomonName] = useState('');
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    const handleSubmit = async (e: any) => {
        e.preventDefault()

        //use sign up hook part
    

        const signup = async (username: string, email: string,password: string, pokemonName: string) => {
            setIsLoading(true)
            setError(null)

            const response = await fetch('http://localhost:8000/user/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username,email,password,pokemonName})
            })
            const json = await response.json()
            if(!response.ok){
                setIsLoading(false)
                setError(json.error)
            }
            else
            {
                setError(null)
                setIsLoading(false)
                localStorage.setItem('user',JSON.stringify(json))
                f(json)
            }
        }
        signup(username, email, password, pokemonName)
    }


    return ( 
        <div className=" flex items-center justify-center py-36">
            <form className=" border border-solid border-gray-300 shadow-lg  p-8 font-poppins">
                
                <h3 className="text-center font-poppins text-2xl font-semibold mb-6 text-white">Sign Up</h3>

                <label className="block text-white mb-2">Username: </label>
                <input className="w-full p-2 mb-4 border-b-[1px] border-white outline-none focus:border-blue-500 bg-inherit" type='text' onChange={(e)=>setUsernmae(e.target.value)} value = {username}/>
                <label className="block text-white mb-2">Email: </label>
                <input className="w-full p-2 mb-6 border-b-[1px] border-white outline-none focus:border-blue-500 bg-inherit" type='text' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                <label className="block text-white mb-2">Password: </label>
                <input className="w-full p-2 mb-6 border-b-[1px] border-white outline-none focus:border-blue-500 bg-inherit" type='password' onChange={(e)=>setPassword(e.target.value)} value={password} />

                <p>Choose Your Starter Pokemon: </p>
                <div className="flex flex-wrap justify-center my-5">
                    
                    <div className="m-2 font-poppins flex flex-col justify-center items-center border-[1px] border-solid border-gray-100 p-5 ">
                        <div>
                            <img className="w-52 m-3 mb-5" src="../assets/pokemon/Pikachu.png"/>
                        </div>
                        <div>Pikachu </div>
                        <div>HP: 130</div>
                        <button  className="hover:bg-purple-500 hover:cursor-pointer hover:text-white bg-slate-300 text-black py-1 px-2"  onClick={(e)=>{
                            e.preventDefault();
                            setPokeomonName("Pikachu");
                        }}>Choose</button>
                    </div>

                    <div className="m-2 font-poppins flex flex-col justify-center items-center border-[1px] border-solid border-gray-100 p-5 ">
                        <div>
                            <img className="w-52 m-3 mb-5" src="../assets/pokemon/Gengar.png"/>
                        </div>
                        <div>Gengar</div>
                        <div> HP: 140</div>
                        <button  className="hover:bg-purple-500 hover:cursor-pointer hover:text-white bg-slate-300 text-black py-1 px-2"  onClick={(e)=>{
                            e.preventDefault();
                            setPokeomonName("Gengar");
                        }}>Choose</button>
                    </div>

                    <div className="m-2 font-poppins flex flex-col justify-center items-center border-[1px] border-solid border-gray-100 p-5 ">
                        <div>
                            <img className="w-52 m-3 mb-5" src="../assets/pokemon/Arcanine.png"/>
                        </div>
                        <div>Arcanine</div>
                        <div>HP: 175</div>
                        <button  className="hover:bg-purple-500 hover:cursor-pointer hover:text-white bg-slate-300 text-black py-1 px-2" onClick={(e)=>{
                            e.preventDefault();
                            setPokeomonName("Arcanine");
                        }}>Choose</button>
                    </div>
                </div>

                <button className={`w-full py-2 px-4 text-white font-bold bg-green-500 rounded transition-transform transform ${
            isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
          }`} disabled={isLoading} onClick={handleSubmit}>Sign Up</button>
                {error && <div>{error}</div>}
            </form>
        </div>
     );
}
 
export default Signup;