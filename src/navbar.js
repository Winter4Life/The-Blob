import { BrowserRouter as Navigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import createPostIMG from "./images/create.webp";
import notificationIMG from "./images/bell.webp";
import profileIMG from './images/profile.png';

function Navbar() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  const handleSignOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      return <Navigate to="/login" />;
    });
  };

  return (
    <nav className="nav">
      <Link to="/" className="title">
        The Blob
      </Link>
      <ul>
        <li>
        {!isAuth && (
          <Link to="/createPost">
            <img src={createPostIMG} alt="Create Post" className="img-post"/>
          </Link>
        )}
        </li>
        <li>
          <Link to="/notificationBox">
            <img src={notificationIMG} alt="Notifications" className="img-box"/>
          </Link>
        </li>
        <li>
            <input placeholder="search" className="searchBox"/>
        </li>
        <li>
        {!isAuth ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <button onClick={handleSignOut}>Log Out</button>
          </>
        )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;