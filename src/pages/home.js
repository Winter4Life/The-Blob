// Home.js
import React from "react";
import { Link } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import blobImage from '../images/blob.jpg';
import '../style/home.css';

function usePosts() {
  const [postLists, setPostList] = React.useState([]);
  const navigate = useNavigate();

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    navigate("/");
  };

  const getPosts = async () => {
    try {
      const data = await getDocs(collection(db, "posts"));
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  return { postLists, deletePost, getPosts };
}

function Home({ isAuth }) {
  const { postLists, deletePost, getPosts } = usePosts();

  console.log("Post Lists:", postLists);

  const handleDeleteAllPosts = async () => {
    try {
      console.log("Deleting all posts...");

      postLists.forEach((post) => {
        deletePost(post.id);
      });

      console.log("All posts deleted successfully!");

      getPosts();
    } catch (error) {
      console.error("Error deleting all posts:", error);
    }
  };

  return (
    <div className="container">
      <div className="intro">
        <h1 >Welcome to the BLOB!</h1>
        <img src={blobImage} alt="Blob" />
      </div>
      {postLists.map((post) => (
        <Link key={post.id} to={`/post/${post.id}`} className="post">
          <div className="deletePost">
              {isAuth && post.author.id === auth.currentUser.uid && (
                <button onClick={() => deletePost(post.id)}>&#128465;</button>
              )}
            </div>
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
            {/* Replace post.author.name with username */}
            <h3 className="authorName">@{post.author.name}</h3>
          </div>
    
        </Link>
      ))}
    </div>
  );
}

export default Home;

/*       <button onClick={handleDeleteAllPosts}>Delete All Posts</button>
*/