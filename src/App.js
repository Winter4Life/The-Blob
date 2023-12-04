import Navbar from './navbar';
import Home from './pages/home'
import Login from './pages/login'
import CreateAcc from './pages/createAcc'
import CreatePost from './pages/createPost';
import NotificationBox from './pages/notificationBox'
import Profile from './pages/profile'
import Logout from './pages/logout'
import Post from './pages/post'
import { Route, Routes } from "react-router-dom"
import { useState } from 'react';
//import Authentication from './Authenticate'

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  return (
    <>
    <Navbar />
    <div className="container">
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path='/logout' element={<Logout />} />
        <Route path="/createAcc" element={<CreateAcc />} />
        <Route path='/createPost' element={<CreatePost isAuth={isAuth}/>} />
        <Route path='/notificationBox' element={<NotificationBox isAuth={isAuth}/>} />
        <Route path='/profile' element={<Profile isAuth={isAuth}/>} />
        <Route path='/post/:postId' element={<Post />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
