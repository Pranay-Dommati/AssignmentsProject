import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

function HomePage() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  return (
    <div className="homepage-container">
      <div className="button-container">
        {isLoggedIn ? (
          <>
            <Link to="/add-assignment">
              <button className="action-button">Add Assignment</button>
            </Link>
            <Link to="/place-bid">
              <button className="action-button">Place Your Bid</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="action-button">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="action-button">Login</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;