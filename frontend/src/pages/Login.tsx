
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (prop: any) => {

    const navigate = useNavigate();
    const f = prop.updateUserContext

    useEffect(()=>{

        if(prop.user) {
            navigate('/');
        }

    },[prop.user])

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        


        const login  = async (username: string,password: string) => {
            setIsLoading(true)
            setError(null)

            const response = await fetch('http://localhost:8000/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username,password})
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
        login(username,password);
    }



    return ( 
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className=" border border-solid border-gray-300 shadow-lg  p-8 font-poppins"> 
                <h3 className="text-center  text-2xl font-semibold mb-6 text-white">Login</h3>

                <label className="block text-white mb-2">Username: </label>
                <input className="w-full p-2 mb-4 border-b-[1px] border-white outline-none focus:border-blue-500 bg-inherit" type='text' onChange={(e)=>setUsername(e.target.value)} value={username}/>
                <label className="block text-white mb-2">Password: </label>
                <input className="w-full p-2 mb-6 border-b-[1px] border-white outline-none focus:border-blue-500 bg-inherit" type='password' onChange={(e)=>setPassword(e.target.value)} value={password} />

                <button className={`w-full py-2 px-4 text-white font-bold bg-green-500 rounded transition-transform transform ${
            isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
          }`} disabled={isLoading}>Login</button>
                {error && <div>{error}</div>}

            </form>
        </div>
     );
}
 
export default Login;