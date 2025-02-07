import React, { useState } from "react";
import "../styles/placebid.css"; // Ensure styles exist
import { useNavigate } from "react-router-dom";

function PlaceBid() {
  const navigate = useNavigate();

  const [assignments] = useState([
    {
      id: 1,
      subject: "Mathematics Assignment",
      numPages: 10,
      minBid: 500,
      maxBid: 1000,
      locations: ["Location 1", "Location 2"],
      collegeOrSchool: "XYZ College",
    },
    {
      id: 2,
      subject: "Science Assignment",
      numPages: 5,
      minBid: 300,
      maxBid: 800,
      locations: ["Location 3", "Location 4"],
      collegeOrSchool: "ABC School",
    },
    {
      id: 3,
      subject: "English Literature",
      numPages: 8,
      minBid: 400,
      maxBid: 900,
      locations: ["Location 5", "Location 6"],
      collegeOrSchool: "DEF University",
    },
  ]);

  const [filters, setFilters] = useState({
    searchQuery: "",
    searchBy: "area",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const searchTerm = filters.searchQuery.toLowerCase();
    return (
      (filters.searchBy === "area" &&
        assignment.locations.some((location) =>
          location.toLowerCase().includes(searchTerm)
        )) ||
      (filters.searchBy === "bid" &&
        Number(filters.searchQuery) <= assignment.maxBid &&
        Number(filters.searchQuery) >= assignment.minBid) ||
      (filters.searchBy === "college" &&
        assignment.collegeOrSchool.toLowerCase().includes(searchTerm))
    );
  });

  const getSearchPlaceholder = () => {
    switch (filters.searchBy) {
      case "area":
        return "Search by area";
      case "bid":
        return "Enter Min Bid";
      case "college":
        return "Search by college/school name";
      default:
        return "Search...";
    }
  };

  return (
    <div className="place-bid-container">
      <div className="filters-container">
        <div className="filter-group container-fluid p-0">
          <div className="row d-flex align-items-center w-100 m-0">
            <div className="col-2 p-0">
              <select
                name="searchBy"
                value={filters.searchBy}
                onChange={handleFilterChange}
                className="search-dropdown form-select"
              >
                <option value="area">Search by Area</option>
                <option value="bid">Search by Bid</option>
                <option value="college">Search by College/School</option>
              </select>
            </div>

            <div className="col-10 p-0">
              <input
                type={filters.searchBy === "bid" ? "number" : "text"}
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder={getSearchPlaceholder()}
                className="search-input form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="assignments-container">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <h3>{assignment.subject}</h3>
              <p>
                <strong>Pages:</strong> {assignment.numPages}
              </p>
              <p>
                <strong>Bid Range:</strong> ₹{assignment.minBid} - ₹{assignment.maxBid}
              </p>
              <p>
                <strong>Locations:</strong> {assignment.locations.join(", ")}
              </p>
              <p>
                <strong>College/School:</strong> {assignment.collegeOrSchool}
              </p>
              <button
                className="place-bid-btn"
                onClick={() => navigate(`/place-bid/${assignment.id}`)}
              >
                Place Your Bid
              </button>
            </div>
          ))
        ) : (
          <p>No matching assignments found.</p>
        )}
      </div>
    </div>
  );
}

export default PlaceBid;