import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { Link } from 'react-router-dom';
import createPostIMG from './images/create.webp';
import notificationIMG from './images/bell.webp';
import profileIMG from './images/profile.png';
import SearchBox from './searchBox'; // Import the SearchBox component
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate('/');
    });
  };

  return (
    <nav className="nav">
      <Link to="/" className="title">
        <span className="white-text">The</span>
        <span className="red-text">Blob</span>
      </Link>
      <ul>
        <li>
          {isAuth && (
            <Link to="/createPost">
              <img src={createPostIMG} alt="Create Post" className="img-post" />
            </Link>
          )}
        </li>
        <li>
          <Link to="/notificationBox">
            <img src={notificationIMG} alt="Notifications" className="img-box" />
          </Link>
        </li>
        <li>
          {/* Include the SearchBox component here */}
          <SearchBox />
        </li>
        <li>
          {!isAuth ? (
            <Link to="/login" className="login-nav">
              Login
            </Link>
          ) : (
            <>
              <button onClick={handleSignOut} className="logoutButton">
                Log Out
              </button>
            </>
          )}
        </li>
        <li>
          <Link to="/profile">
            <img src={profileIMG} alt="Profile" className="img-profile" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
