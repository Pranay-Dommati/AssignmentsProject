import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/assignment-bids.css'; // Ensure styles exist

const AssignmentBids = () => {
  const { id } = useParams();
  const [bids, setBids] = useState([]);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assignment = allAssignments.find(a => a.id === parseInt(id));
    setAssignment(assignment);

    const allBids = JSON.parse(localStorage.getItem('bids')) || [];
    const assignmentBids = allBids.filter(bid => bid.assignmentId === parseInt(id));
    assignmentBids.sort((a, b) => a.bidPrice - b.bidPrice); // Sort bids by bid price
    setBids(assignmentBids);
  }, [id]);

  const handleConfirmBid = (bidIndex) => {
    // Handle bid confirmation logic here
    console.log(`Bid confirmed: ${bids[bidIndex].bidPrice}`);
  };

  if (!assignment) {
    return <p>Assignment not found</p>;
  }

  return (
    <div className="assignment-bids-container">
  
      <div className="assignment-details">
        <p><strong>Assignment Name:</strong> {assignment.subject}</p>
        <p><strong>Pages:</strong> {assignment.numPages}</p>
        <p><strong>Bid Range:</strong> ₹{assignment.minBid} - ₹{assignment.maxBid}</p>
        <p><strong>College/School:</strong> {assignment.collegeOrSchool}</p>
        <p><strong>Locations:</strong></p>
        <ul>
          {assignment.locations.map((location, index) => (
            <li key={index}>{location.name}</li>
          ))}
        </ul>
      </div>
      <h3>Placed Bids</h3>
      {bids.length > 0 ? (
        bids.map((bid, index) => (
          <div key={index} className="bid-card">
            <p><strong>Bid Price:</strong> ₹{bid.bidPrice}</p>
            <p><strong>Location:</strong> {bid.location}</p>
            <p><strong>Email:</strong> {bid.email}</p>
            <button onClick={() => handleConfirmBid(index)} className="btn btn-success">
              Confirm Bid
            </button>
          </div>
        ))
      ) : (
        <p>No bids found.</p>
      )}
    </div>
  );
};

export default AssignmentBids;