import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/user-assignments.css'; // Ensure styles exist

const UserAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const userAssignments = allAssignments.filter(assignment => assignment.email === user.email);
    userAssignments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp in descending order
    setAssignments(userAssignments);
  }, [user.email]);

  return (
    <div className="user-assignments-container">
      <h2>My Assignments</h2>
      {assignments.length > 0 ? (
        assignments.map((assignment, index) => (
          <div key={index} className="assignment-card">
            <h3>{assignment.subject}</h3>
            <p><strong>Pages:</strong> {assignment.numPages}</p>
            <p><strong>Bid Range:</strong> ₹{assignment.minBid} - ₹{assignment.maxBid}</p>
            <p><strong>College/School:</strong> {assignment.collegeOrSchool}</p>
            <p><strong>Locations:</strong></p>
            <ul>
              {assignment.locations.map((location, index) => (
                <li key={index}>{location.name}</li>
              ))}
            </ul>
            <Link to={`/assignment-bids/${assignment.id}`} className="btn btn-primary mt-3">
              View Bids
            </Link>
          </div>
        ))
      ) : (
        <p>No assignments found.</p>
      )}
    </div>
  );
};

export default UserAssignments;