import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Store from './pages/Store'

function App() {

  const [user, setUser] = useState(null);

  useEffect(()=>{
    const user =  JSON.parse(localStorage.getItem('user') as string)
    if(user) {
      setUser(user);
    }

  },[])

  const updateUserContext = (user_object: any) => {
    setUser(user_object)
  }

  return (
    <div className=' text-white h-screen w-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home setUser={setUser} user={user} />}/>
          <Route path='/store' element={user? <Store user={user}/>: <Home setUser={setUser} user={user} /> } />
          <Route path='/login' element={<Login updateUserContext={updateUserContext} user={user}/>} />
          <Route path = '/signup' element = {<Signup updateUserContext={updateUserContext} user={user} />} />
          <Route path='/arena' element = {user? <Game />: <Home setUser={setUser} user={user} /> }/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
