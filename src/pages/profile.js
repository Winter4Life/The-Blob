// Profile.js
import React, { useEffect, useState } from "react";
import { doc, getDoc,updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likesReceived, setLikesReceived] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;

      if (user) {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          setNewBio(userDoc.data().bio || "");
        }
      }
    };

    const fetchUserPosts = async () => {
      const user = auth.currentUser;

      if (user) {
        // Fetch user posts from Firestore
        const postsQuery = query(collection(db, "posts"), where("author.id", "==", user.uid));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Calculate likes received
        const totalLikes = postsData.reduce((sum, post) => sum + (post.likes || 0), 0);
        setLikesReceived(totalLikes);

        // Set total number of posts
        setTotalPosts(postsData.length);

        setUserPosts(postsData);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const handleEditBio = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    try {
      // Update user bio in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { bio: newBio });
  
      console.log("Bio updated successfully!");
  
      // Update state
      setUserProfile((prevProfile) => ({ ...prevProfile, bio: newBio }));
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  
    // Reset editing mode
    setEditingBio(false);
  };
  
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1>{userProfile.username}'s Profile</h1>

      {/* Bio Section */}
      <div>
        {editingBio ? (
          <div>
            <p>Edit Bio:</p>
            <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
            <button onClick={handleEditBio}>Save</button>
          </div>
        ) : (
          <div>
            <p>Bio: {userProfile.bio || "Not provided"}</p>
            <button onClick={() => setEditingBio(true)}>Edit Bio</button>
          </div>
        )}
      </div>

      <div>
        <h2>Posts ({totalPosts}):</h2>
        {userPosts.map((post) => (
          <div key={post.id} className="user-post">
            <p>{post.title} - Likes: {post.likes || 0}</p>
          </div>
        ))}
      </div>

      <p>Total Likes Received: {likesReceived}</p>
    </div>
  );
}

export default Profile;
