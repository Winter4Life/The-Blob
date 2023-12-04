// Post.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with postId:", postId);
        const postDoc = await getDoc(doc(db, "posts", postId));
        console.log("Fetched post:", postDoc.data());
        if (postDoc.exists()) {
          setPost({ ...postDoc.data(), id: postDoc.id });
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
  
    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post">
      <div className="postHeader">
        <div className="post-title">
          <h1 className="text-title">{post.title}</h1>
        </div>
      </div>
      <div className="picturePost">
        {post.img && <img src={post.img} alt="Post" />}
      </div>
      <div className="postContainer">
        <div className="postTextContainer">
          <p className="postText">{post.postText}</p>
        </div>
        <h3 className="authorName">@{post.author.name}</h3>
      </div>
    </div>
  );
}

export default Post;
