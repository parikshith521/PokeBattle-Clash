
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
        <div>
            <form onSubmit={handleSubmit}> 
                <h3 >Login</h3>

                <label>Username: </label>
                <input type='text' onChange={(e)=>setUsername(e.target.value)} value={username}/>
                <label >Password: </label>
                <input  type='password' onChange={(e)=>setPassword(e.target.value)} value={password} />

                <button disabled={isLoading}>Login</button>
                {error && <div>{error}</div>}

            </form>
        </div>
     );
}
 
export default Login;