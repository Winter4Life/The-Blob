import Navbar from './navbar';
import Home from './pages/home'
import Login from './pages/login'
import CreateAcc from './pages/createAcc'
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
        <Route path="/createAcc" element={<CreateAcc />} />
      </Routes>
    </div>
    </>
  )
}

export default App;
