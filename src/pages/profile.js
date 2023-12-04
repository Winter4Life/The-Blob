import React, { useEffect, useState } from "react";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);

      const userDocRef = doc(db, "users", user.uid);
      console.log("Before onSnapshot - User ID:", user.uid);
      const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
        console.log("User document data:", doc.data());
        setUsername(doc.data()?.username || "");
      });
      console.log("After onSnapshot");

      return () => unsubscribeFirestore();
    } else {
      setCurrentUser(null);
      setUsername("");
      navigate("/createAcc");
    }
  });

  return () => unsubscribe();
}, [auth, db, navigate]);

  // Render nothing if redirecting
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      {/* Other profile content goes here */}
    </div>
  );
};

export default Profile;
