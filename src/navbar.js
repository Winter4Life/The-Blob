import React, { useState } from "react";
import { Link } from "react-router-dom";
import createPostIMG from "./images/create.webp";
import notificationIMG from "./images/bell.webp";
import profileIMG from './images/profile.png';

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="title">
        The Blob
      </Link>
      <ul>
        <li>
          <Link to="/createPost">
            <img src={createPostIMG} alt="Create Post" className="img-post"/>
          </Link>
        </li>
        <li>
          <Link to="/notificationBox">
            <img src={notificationIMG} alt="Notifications" className="img-box"/>
          </Link>
        </li>
        <li>
            <input placeholder="search" className="searchBox"/>
        </li>
        <li>
          <Link to="/createAcc">
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
}
