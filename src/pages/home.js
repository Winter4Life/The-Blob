import React from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import blobImage from '../images/blob.jpg';
import '../style/home.css';

function usePosts() {
  const [postLists, setPostList] = React.useState([]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
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
        <h1>Welcome to the BLOB!</h1>
        <img src={blobImage} alt="Blob" />
      </div>
      <button onClick={handleDeleteAllPosts}>Delete All Posts</button>
        {postLists.map((post) => (
            <div className="post">
          <div key={post.id}>
            <div className="postHeader">
              <div className="post-title">
                <h1 className="text-title">{post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button onClick={() => deletePost(post.id)}>&#128465;</button>
                )}
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
          </div>
        ))}
    </div>
  );
}

export default Home;
