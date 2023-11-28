// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYg2cRdtMKjUQRfnUhUjgpRT7GAxRu6Lw",
  authDomain: "interactive-blog-69659.firebaseapp.com",
  projectId: "interactive-blog-69659",
  storageBucket: "interactive-blog-69659.appspot.com",
  messagingSenderId: "520979559260",
  appId: "1:520979559260:web:0be7772b83f7462858c799",
  measurementId: "G-PVDE8ZTCV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
