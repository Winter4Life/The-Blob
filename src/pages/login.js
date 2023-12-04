import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Authentication from '../Authenticate'
import { Link } from "react-router-dom";

import emailIMG from '../images/email.png'
import passwordIMG from '../images/password.png'

import '../style/login.css'

function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      navigate("/");
    });
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuth(true);
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign in error:", error);
        alert("Incorrect username or password. Please try again.");
      });
  };

  return (
    <div>
    <form className="container" onSubmit={signIn}>
      <div className="header"> 
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={emailIMG} alt="username"></img>
          <input 
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="input">
          <img src={passwordIMG} alt="username"></img>
          <input 
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
      </div>
      <div>
      </div>
      <div className="submit-container">
        <Link to="/createAcc" className="signup">Sign Up</Link>
        <button className="submit" type="submit">Login</button>
      </div>
      <div className="google">
      <button className="GoogleLog" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      </div>
    </form>
    </div>
    
)}

export default Login;