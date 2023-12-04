import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from 'react-router-dom';
import blobImage from '../images/blob.jpg';
import '../style/home.css';

export default function home() {
    return (
        <div>
            <h1>Welcome to the BLOB</h1>
            <img src={blobImage} />
        </div>
        
)}