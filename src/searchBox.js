import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      console.log('Search Query:', searchQuery);

      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('title', '==', searchQuery.toLowerCase()));

      const querySnapshot = await getDocs(q);

      const newSearchResults = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Search Results:', newSearchResults);

      setSearchResults(newSearchResults);

      // Navigate to the search results page
      navigate(`/search-results/${searchQuery}`);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleKeyPress = (e) => {
    // Trigger search on Enter key press
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBox;
