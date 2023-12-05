import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import '../style/post.css';
function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          setUsername(doc.data()?.username || "");
        });

        return () => unsubscribeFirestore();
      } else {
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleLikePost = async () => {
    const userId = auth.currentUser?.uid;

    try {
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      if (!post.likedBy || !post.likedBy.includes(userId)) {
        await updateDoc(doc(db, "posts", postId), {
          likes: (post.likes || 0) + 1,
          likedBy: arrayUnion(userId),
        });

        setPost((prevPost) => ({
          ...prevPost,
          likes: (prevPost.likes || 0) + 1,
          likedBy: Array.isArray(prevPost.likedBy)
            ? [...prevPost.likedBy, userId]
            : [userId],
        }));
      } else {
        console.log("User has already liked the post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const authorName = username || "Unknown";

      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          text: newComment,
          author: {
            name: authorName,
            id: currentUser.uid,
          },
          timestamp: new Date().toISOString(),
        }),
      });

      const updatedPostDoc = await getDoc(doc(db, "posts", postId));
      const updatedPostData = updatedPostDoc.data();

      setPost(updatedPostData);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
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
      <div className="picturePost">{post.img && <img src={post.img} alt="Post" />}</div>
      <div className="postContainer">
        <div className="postTextContainer">
          <p className="postText">{post.postText}</p>
        </div>
        <h3 className="authorName">@{post.author?.name}</h3>

        <p>Likes: {post.likes || 0}</p>

        {/* Likes Section */}
        <div className="likesContainer">

          <button onClick={handleLikePost} className={post.likedBy && post.likedBy.includes(auth.currentUser?.uid) ? 'liked' : ''}>
            {post.likedBy && post.likedBy.includes(auth.currentUser?.uid) ? '❤️' : '🤍'}
          </button>

        </div>


        {/* Comments Section */}
        <div>
          <h2>Comments:</h2>
          {post.comments && post.comments.length > 0 ? (
            <div>
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>{comment.text}</p>
                  <p>@{comment.author?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No comments yet.</p>
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
