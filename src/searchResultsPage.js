import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

function SearchResultsPage({ searchResults }) {
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const searchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('title', '==', searchResults));

        const querySnapshot = await getDocs(q);

        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFilteredResults(posts);
      } catch (error) {
        console.error('Error searching posts:', error);
      }
    };

    if (searchResults) {
      searchPosts();
    }
  }, [searchResults]);

  return (
    <div className="home-postContainer">
      {filteredResults && filteredResults.length > 0 ? (
        filteredResults.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`} className="home-post">
            <div className="home-postHeader">
              <h1>{post.title}</h1>
            </div>
            <div className="home-picturePost">
              {post.img && <img src={post.img} alt="Post" className="home-picture" />}
            </div>
            <div className="home-textContainer">
              <p>{post.postText}</p>
            </div>
            <div className="home-authorName">
              <h3>@{post.author.name}</h3>
            </div>
          </Link>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
