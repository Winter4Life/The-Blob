import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db as firestore } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

import Authentication from "../Authenticate";
import nameIMG from "../images/person.png";
import emailIMG from "../images/email.png";
import passwordIMG from "../images/password.png";
import "../style/createAcc.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

      // Check if any of the required fields are empty
  if (!username || !email || !password) {
    // Show an alert if any field is empty
    alert("Please fill in all the required fields.");
    return;
  }
  
    if (password.length < 6) {
      // Password is too short, show an alert
      alert("Password must be 6 characters or longer.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save additional user data to Firestore, including the username
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        username,
        email,
      });

      // Navigate to the profile page
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="input">
          <img src={emailIMG} alt="email"></img>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="input">
          <img src={passwordIMG} alt="password"></img>
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
        <button className="submit" type="submit">
          Sign Up
        </button>
        <Link to="/login" className="login">
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignUp;