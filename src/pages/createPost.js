import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [img, setImg] = useState("");
  const [data, setData] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

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
          author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
        });
      } else {
        // If no image file, simply add the post without the img field
        await addDoc(postsCollectionRef, {
          title,
          postText,
          author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
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

  useEffect(() => {
    if (!isAuth) {
      navigate("/createAcc");
    }
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
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
          {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Uploaded" />}
        </div>
        <div>
          {img && <img src={img} alt="Uploaded" />}
        </div>
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
