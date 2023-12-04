import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

import Authentication from '../Authenticate'
import nameIMG from '../images/person.png'
import emailIMG from '../images/email.png'
import passwordIMG from '../images/password.png'

import '../style/createAcc.css'



const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  }; 

  return (
    <form className="container" onSubmit={signUp}>
      <div className="header"> 
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={nameIMG} alt="username"></img>
          <input 
          type="text"
          placeholder="username"
          ></input>
        </div>
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
        <button className="submit" typeof="submit">Sign Up</button>
        <Link to="/login" className="login">Login</Link>
      </div>
      <Authentication />
    </form>
)} 

export default SignUp;