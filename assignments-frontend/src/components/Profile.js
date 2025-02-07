import React from 'react';
import '../styles/profile.css'; // Ensure styles exist

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p>No user data found.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <p><strong>Email:</strong></p>
          <p>{user.email}</p>
        </div>
        <div className="detail-item">
          <p><strong>College Name:</strong></p>
          <p>{user.collegeName}</p>
        </div>
        <div className="detail-item">
          <p><strong>Mobile Number:</strong></p>
          <p>{user.mobileNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;