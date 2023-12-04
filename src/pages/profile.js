import React, { useEffect, useState } from "react";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        // Retrieve user data from Firestore based on the currently logged-in user
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          setUsername(doc.data()?.username || "");
        });

        return () => unsubscribeFirestore();
      } else {
        setCurrentUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  return (
    <div>
      {currentUser ? (
        <>
          <h1>Welcome, {username}!</h1>
          {/* Other profile content goes here */}
        </>
      ) : (
        <p>Please sign in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
