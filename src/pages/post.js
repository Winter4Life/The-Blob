// Post.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({ comments: [] }); // Updated initialization
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with postId:", postId);
        const postDoc = await getDoc(doc(db, "posts", postId));
        console.log("Fetched post:", postDoc.data());
        if (postDoc.exists()) {
          setPost({ ...postDoc.data(), id: postDoc.id });
          // Set initial likes count
          setLikes(postDoc.data().likes || 0);
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async () => {
    try {
      // Update Firestore with the new comment
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          text: newComment,
          author: {
            name: "Current User", // Replace with the actual user's name
            id: "CurrentUserId", // Replace with the actual user's ID
          },
          timestamp: new Date().toISOString(),
        }),
      });

      // Update local state with the new comment
      setPost((prevPost) => ({
        ...prevPost,
        comments: [
          ...prevPost.comments,
          {
            text: newComment,
            author: {
              name: "Current User", // Replace with the actual user's name
              id: "CurrentUserId", // Replace with the actual user's ID
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      // Clear the new comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikePost = async () => {
    try {
      // Update Firestore with the new like count
      await updateDoc(doc(db, "posts", postId), {
        likes: likes + 1,
      });

      // Update local state with the new like count
      setLikes(likes + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

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

        {/* Likes Section */}
        <div>
          <p>Likes: {likes}</p>
          <button onClick={handleLikePost}>Like</button>
        </div>

        {/* Comments Section */}
        <div>
          <h2>Comments:</h2>
          {post.comments && (
            <div>
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>{comment.text}</p>
                  <p>@{comment.author.name}</p>
                </div>
              ))}
            </div>
          )}
          {/* New Comment Input */}
          <div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
