import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from "firebase/auth";


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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider, ref, uploadBytes, getDownloadURL };