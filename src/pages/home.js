import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from 'react-router-dom';
import blobImage from '../images/blob.jpg';
import '../style/home.css';

function usePosts() {
  const [postLists, setPostList] = useState([]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await getDocs(collection(db, "posts"));
        setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, [deletePost]);

  return { postLists, deletePost };
}

export function Home({ isAuth }) {
  const { postLists, deletePost } = usePosts();

  return (
    <div className="container">
        <div className="intro">
            <h1>Welcome to the BLOB!</h1>
            <img src={blobImage} />
        </div>
    <div className="post">
      {postLists.map((post) => {
        return (
          <div key={post.id}>
            <div className="postHeader">
              <div className="post-title">
                <h1 className="text-title">{post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    &#128465;
                  </button>
                )}
              </div>
            </div>
            <div className="picturePost">
            {post.img && <img src={post.img} alt="Post" />} {/* Display the image if it exists */}
            </div>
            <div className="postContainer">
            <div className="postTextContainer">
                <p className="postText">{post.postText}</p>
            </div>
            <h3 className="authorName">@{post.author.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}

export default Home;