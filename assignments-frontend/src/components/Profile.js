import React, { useEffect, useState } from 'react';
import '../styles/profile.css'; // Ensure styles exist

const Profile = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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
          <p>{user.college_name}</p>
        </div>
        <div className="detail-item">
          <p><strong>Mobile Number:</strong></p>
          <p>{user.mobile_number}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;