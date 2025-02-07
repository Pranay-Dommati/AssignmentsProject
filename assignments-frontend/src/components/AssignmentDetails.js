import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/assignment-details.css"; // Ensure styles exist

const AssignmentDetails = ({ assignments }) => {
  const { id } = useParams();
  const assignment = assignments.find((a) => a.id === parseInt(id));

  const [formData, setFormData] = useState({
    email: "",
    bidPrice: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.bidPrice || isNaN(formData.bidPrice) || formData.bidPrice < assignment.minBid || formData.bidPrice > assignment.maxBid) {
      newErrors.bidPrice = `Bid price must be between ₹${assignment.minBid} and ₹${assignment.maxBid}`;
    }
    if (!formData.location) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const allBids = JSON.parse(localStorage.getItem('bids')) || [];
      const newBid = { ...formData, assignmentId: assignment.id, userEmail: formData.email, date: new Date() };
      allBids.push(newBid);
      localStorage.setItem('bids', JSON.stringify(allBids));
      setIsSubmitting(false);
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  const closeModal = () => {
    setShowConfirmation(false);
  };

  if (!assignment) {
    return <p>Assignment not found</p>;
  }

  return (
    <div className="assignment-details-container container mt-5">
      <div className="card">
        <div className="card-body">
          <p><strong>Assignment Name:</strong> {assignment.subject}</p>
          <p><strong>Pages:</strong> {assignment.numPages}</p>
          <p><strong>Bid Range:</strong> ₹{assignment.minBid} - ₹{assignment.maxBid}</p>
          <p><strong>College/School:</strong> {assignment.collegeOrSchool}</p>
          <p><strong>Locations:</strong> {assignment.locations.join(", ")}</p>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5>Place Your Bid</h5>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
              />
              {errors.email && <small className="error-text text-danger">{errors.email}</small>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="bidPrice">Bid Price</label>
              <input
                type="number"
                id="bidPrice"
                name="bidPrice"
                value={formData.bidPrice}
                onChange={handleChange}
                className="form-control"
                placeholder={`Enter your bid (₹${assignment.minBid} - ₹${assignment.maxBid})`}
              />
              {errors.bidPrice && <small className="error-text text-danger">{errors.bidPrice}</small>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a location</option>
                {assignment.locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && <small className="error-text text-danger">{errors.location}</small>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Place Bid"}
            </button>
          </form>
        </div>
      </div>

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <p>Bid placed successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;