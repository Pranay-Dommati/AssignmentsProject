import React, { useEffect, useState } from 'react';
import '../styles/placed-bids.css'; // Ensure styles exist

const PlacedBids = ({ assignments }) => {
  const [bids, setBids] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const allBids = JSON.parse(localStorage.getItem('bids')) || [];
    const userBids = allBids.filter(bid => bid.userEmail === user.email);
    userBids.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort bids from latest to oldest
    setBids(userBids);
  }, [user.email]);

  const getAssignmentDetails = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment : { subject: 'Unknown Assignment', numPages: 'N/A' };
  };

  return (
    <div className="placed-bids-container">
      <h2>My Placed Bids</h2>
      {bids.length > 0 ? (
        bids.map((bid, index) => {
          const assignmentDetails = getAssignmentDetails(bid.assignmentId);
          return (
            <div key={index} className="bid-card">
              <h3>Assignment Name: {assignmentDetails.subject}</h3>
              <p><strong>Number of Pages:</strong> {assignmentDetails.numPages}</p>
              <p><strong>Bid Price:</strong> ₹{bid.bidPrice}</p>
              <p><strong>Location:</strong> {bid.location}</p>
            </div>
          );
        })
      ) : (
        <p>No bids found.</p>
      )}
    </div>
  );
};

export default PlacedBids;