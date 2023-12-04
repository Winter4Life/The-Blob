// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
const firebaseConfig = {
  apiKey: "AIzaSyDYg2cRdtMKjUQRfnUhUjgpRT7GAxRu6Lw",
  authDomain: "interactive-blog-69659.firebaseapp.com",
  projectId: "interactive-blog-69659",
  storageBucket: "interactive-blog-69659.appspot.com",
  messagingSenderId: "520979559260",
  appId: "1:520979559260:web:0be7772b83f7462858c799",
  measurementId: "G-PVDE8ZTCV0"
}; */

const firebaseConfig = {
  apiKey: "AIzaSyD3A4OUi0XCp0UV22YmAgDgdHJho6Zu8zo",
  authDomain: "interactive-f22bc.firebaseapp.com",
  databaseURL: "https://interactive-f22bc-default-rtdb.firebaseio.com/",
  projectId: "interactive-f22bc",
  storageBucket: "interactive-f22bc.appspot.com",
  messagingSenderId: "494611381437",
  appId: "1:494611381437:web:6aab120dd4935090588bd4",
  measurementId: "G-43G5J1FBCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();