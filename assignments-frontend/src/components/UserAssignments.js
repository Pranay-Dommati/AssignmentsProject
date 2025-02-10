import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/user-assignments.css';

const UserAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserAssignments = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.email) {
        throw new Error('User email not found');
      }

      const response = await fetch(`http://localhost:8000/api/user-assignments/${userData.email}/`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAssignments();

    // Add event listener for new assignments
    const handleNewAssignment = () => {
      console.log('New assignment created, refreshing list...');
      fetchUserAssignments();
    };

    window.addEventListener('assignmentCreated', handleNewAssignment);

    // Cleanup
    return () => {
      window.removeEventListener('assignmentCreated', handleNewAssignment);
    };
  }, []);

  if (loading) {
    return (
      <div className="user-assignments-container">
        <div className="loading">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-assignments-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="user-assignments-container">
      <h2>My Assignments</h2>
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <h3>{assignment.subject}</h3>
            <p><strong>Pages:</strong> {assignment.num_pages}</p>
            <p><strong>Bid Range:</strong> ₹{assignment.min_bid} - ₹{assignment.max_bid}</p>
            <p><strong>College/School:</strong> {assignment.college_or_school}</p>
            <p><strong>Locations:</strong></p>
            <ul>
              {assignment.locations.map((location, index) => (
                <li key={index}>{location.name}</li>
              ))}
            </ul>
            <p><strong>Created:</strong> {new Date(assignment.timestamp).toLocaleString()}</p>
            <Link
              to={`/assignment-bids/${assignment.id}`} 
              className="btn btn-primary mt-3"
            >
              View Bids
            </Link>
          </div>
        ))
      ) : (
        <p>No assignments found. Start by adding a new assignment!</p>
      )}
    </div>
  );
};

export default UserAssignments;