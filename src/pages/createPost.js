import React, { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import '../style/createPost.css';

function CreatePost() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [img, setImg] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [usernameLoaded, setUsernameLoaded] = useState(false);

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUsername(userDoc.data()?.username || "");
        setUsernameLoaded(true);
      }
    };

    fetchUsername();
  }, [db]);

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imgRef = ref(storage, `Imgs/${v4()}`);
      uploadBytes(imgRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImg(url);
        });
      });
      setImageFile(file);
    }
  };

  const createPost = async () => {
    try {
      // Wait until the username is loaded
      if (!usernameLoaded) {
        return;
      }

      // Retrieve user information directly
      const currentUser = auth.currentUser;
      const authorName = username; // Use the fetched username
      const authorId = currentUser.uid;

      // Check if there is an image file to upload
      if (imageFile) {
        const imgRef = ref(storage, `Imgs/${v4()}`);
        await uploadBytes(imgRef, imageFile);
        const imgUrl = await getDownloadURL(imgRef);

        // Use imgUrl to store the image URL in Firestore
        await addDoc(postsCollectionRef, {
          title,
          postText,
          img: imgUrl,
          author: { name: authorName, id: authorId },
          comments: [], // Initialize comments as an empty array
        });
      } else {
        // If no image file, simply add the post without the img field
        await addDoc(postsCollectionRef, {
          title,
          postText,
          author: { name: authorName, id: authorId },
          comments: [], // Initialize comments as an empty array
        });
      }

      // Clear the image file state after posting
      setImageFile(null);

      // Reset form fields
      setTitle("");
      setPostText("");
      setImg("");

      // Navigate to the home page or wherever you want to redirect
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create Your Post...</h1>
        <div className="inputGp">
          <label>Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div>
          <input type="file" onChange={(e) => handleUpload(e)} /><br/><br/>
        </div>
        <div className="image-container">
          {img && <img src={img} alt="Uploaded" />}
        </div>
        <div className="button-container">
          <button onClick={createPost} className="post-button">Submit Post</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
