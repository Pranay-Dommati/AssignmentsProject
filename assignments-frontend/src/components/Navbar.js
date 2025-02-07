import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Import custom styles

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo & Website Name on the left */}
      <Link to="/" className="navbar-logo">
        AssignmentWriter
      </Link>

      {/* Right side navigation links */}
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/add-assignment" className="nav-link">
              Add Assignment
            </Link>
            <Link to="/place-bid" className="nav-link">
              Place Your Bid
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/my-assignments" className="nav-link">
              My Assignments
            </Link>
            <Link to="/placed-bids" className="nav-link">
              Placed Bids
            </Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;