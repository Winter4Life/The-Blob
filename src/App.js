import Navbar from './navbar';
import Home from './pages/home'
import Login from './pages/login'
import CreateAcc from './pages/createAcc'
import CreatePost from './pages/createPost';
import NotificationBox from './pages/notificationBox'
import Profile from './pages/profile'
import Logout from './pages/logout'
import { Route, Routes } from "react-router-dom"
//import Authentication from './Authenticate'

function App() {
  return (
    <>
    <Navbar />
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path="/createAcc" element={<CreateAcc />} />
        <Route path='/createPost' element={<CreatePost />} />
        <Route path='/notificationBox' element={<NotificationBox />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
