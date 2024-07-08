
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
    const [pokemonId, setPokeomonId] = useState('');
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    const handleSubmit = async (e: any) => {
        e.preventDefault()

        //use sign up hook part
    

        const signup = async (username: string, email: string,password: string, pokemonId: string) => {
            setIsLoading(true)
            setError(null)

            const response = await fetch('http://localhost:8000/user/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username,email,password,pokemonId})
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
        signup(username, email, password, pokemonId)
    }


    return ( 
        <div>
            <form>
                
                <h3>Sign Up</h3>

                <label>Username: </label>
                <input type='text' onChange={(e)=>setUsernmae(e.target.value)} value = {username}/>
                <label>Email: </label>
                <input type='text' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                <label>Password: </label>
                <input type='password' onChange={(e)=>setPassword(e.target.value)} value={password} />

                {/* need to find better implementation */}
                <p>Choose Your Starter Pokemon: </p>
                <div>
                    
                    <div>
                        <div>
                            <img src="../assets/pokemon/Pikachu.png"/>
                        </div>
                        <div>Pikachu </div>
                        <div>HP: 130</div>
                        <button onClick={(e)=>{
                            e.preventDefault();
                            // setPokeomonId("");
                        }}>Choose</button>
                    </div>

                    <div >
                        <div>
                            <img src="../assets/pokemon/Pikachu.png"/>
                        </div>
                        <div>Lucario</div>
                        <div> HP: 100</div>
                        <button onClick={(e)=>{
                            e.preventDefault();
                            // setPokeomonId("");
                        }}>Choose</button>
                    </div>

                    <div>
                        <div>
                            <img src="../assets/pokemon/Pikachu.png"/>
                        </div>
                        <div>Charizard </div>
                        <div>HP: 160</div>
                        <button onClick={(e)=>{
                            e.preventDefault();
                            // setPokeomonId("");
                        }}>Choose</button>
                    </div>
                </div>

                <button disabled={isLoading} onClick={handleSubmit}>Sign Up</button>
                {error && <div>{error}</div>}
            </form>
        </div>
     );
}
 
export default Signup;