import React, { useEffect, useState } from "react";
import { onSnapshot, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
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
        setBio(doc.data()?.bio || ""); // Set bio from Firestore document
      });
      console.log("After onSnapshot");

      return () => unsubscribeFirestore();
    } else {
      setCurrentUser(null);
      setUsername("");
      setBio("");
      navigate("/createAcc");
    }
  });

  return () => unsubscribe();
}, [auth, db, navigate]);

const handleUpdateBio = async () => {
  // Update the bio in Firestore
  const userDocRef = doc(db, "users", currentUser.uid);
  await updateDoc(userDocRef, { bio });
};

  // Render nothing if redirecting
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <textarea
        placeholder="Enter your bio..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      ></textarea>
      <button onClick={handleUpdateBio}>Update Bio</button>
      {/* Other profile content goes here */}
    </div>
  );
};

export default Profile;
