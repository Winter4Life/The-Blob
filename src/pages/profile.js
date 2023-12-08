import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { uploadBytes, getDownloadURL } from "firebase/storage";

import profileIMG from '../images/profile.png'
import '../style/profile.css'

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [likesReceived, setLikesReceived] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Redirect to /createAcc if user is not logged in
        navigate("/createAcc");
        return;
      }

      // Continue fetching user profile if the user is logged in
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        setNewBio(userDoc.data().bio || "");
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
  }, [navigate]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleUploadImage = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        console.error("User not authenticated");
        return;
      }
  
      if (profileImage) {
        // Upload the image to storage
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`profile-images/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
  
        // Get the image URL
        const imageUrl = await getDownloadURL(imageRef);
  
        // Update the user's profile image in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImage: imageUrl });
  
        // Update state
        setUserProfile((prevProfile) => ({ ...prevProfile, profileImage: imageUrl }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  
    // Reset edit mode
    setEditMode(false);
  };
  

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mainprofile-container">
      <div className="profile-container">
        <div className="profile-img">
          <img
            src={userProfile.profileImage || profileIMG}
            alt="Profile"
            style={{ maxWidth: "100px", borderRadius: "50%" }}
          />
          {editMode && (
            <div>
              <input type="file" onChange={handleImageChange} />
              <button onClick={handleUploadImage}>Upload Image</button>
            </div>
          )}
        </div>
        <div className="profile-content">
          <div className="profile-info">
            <p className="username">@{userProfile.username}</p>
            <p>Total Posts: ({totalPosts})</p>
            <p>Total Likes Received: {likesReceived}</p>
          </div>
          <div className="profile-bio">
            {editingBio ? (
              <div>
                <p>Edit Bio:</p>
                <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                <button onClick={handleEditBio}>Save</button>
              </div>
            ) : (
              <div>
                <p>{userProfile.bio || "edit bio"}</p>
              </div>
            )}
          </div>
        </div>
        <div className="button">
          {!editingBio && (
            <>
              <button onClick={() => setEditingBio(true)}>Edit Bio</button>
              <button onClick={() => setEditMode(true)}>Edit profileIMG</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
