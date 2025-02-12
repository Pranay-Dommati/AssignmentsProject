import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/placebid.css";

function PlaceBid() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('nearby');
  const [allAssignments, setAllAssignments] = useState([]);
  const assignmentsPerPage = 9;

  const getSearchPlaceholder = () => {
    switch(filterBy) {
      case 'nearby':
        return 'Search assignments in nearby locations...';
      case 'college':
        return 'Search assignments by college/school...';
      default:
        return 'Search assignments...';
    }
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || !currentUser.email) {
      setError('Please log in to view assignments');
      setLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enable location services.");
        }
      );
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchAssignments = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.email) {
        throw new Error('Please log in to view assignments');
      }

      const response = await fetch(`http://localhost:8000/api/assignments/`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      
      const otherUsersAssignments = data
        .filter(assignment => assignment.user && assignment.user.email !== currentUser.email)
        .map(assignment => {
          const firstLocation = assignment.locations && assignment.locations[0];
          const distance = firstLocation ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            firstLocation.lat,
            firstLocation.lng
          ) : Infinity;
          return { ...assignment, distance };
        });

      setAllAssignments(otherUsersAssignments);
      applyFiltersAndPagination(otherUsersAssignments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = (assignments) => {
    let filtered = [...assignments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.college_or_school.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch(filterBy) {
      case 'nearby':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'bid':
        filtered.sort((a, b) => a.min_bid - b.min_bid);
        break;
      case 'college':
        filtered.sort((a, b) => a.college_or_school.localeCompare(b.college_or_school));
        break;
      default:
        break;
    }

    // Apply pagination
    const endIndex = page * assignmentsPerPage;
    const paginatedAssignments = filtered.slice(0, endIndex);
    
    setAssignments(paginatedAssignments);
    setHasMore(filtered.length > endIndex);
  };

  useEffect(() => {
    if (userLocation) {
      fetchAssignments();
    }
  }, [userLocation]);

  useEffect(() => {
    if (allAssignments.length > 0) {
      applyFiltersAndPagination(allAssignments);
    }
  }, [searchTerm, filterBy, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading) {
    return <div className="loading">Loading assignments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="place-bid-container">
    <div className="filters-container">
      <div className="filter-group dropdown-group">
        <select 
          className="search-dropdown"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="nearby">Sort by Nearby</option>
          <option value="college">Sort by College</option>
        </select>
      </div>
      <div className="filter-group search-group">
        <input
          type="text"
          className="search-input"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

      <div className="assignments-container">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <h3>{assignment.subject}</h3>
              <p><strong>Pages:</strong> {assignment.num_pages}</p>
              <p><strong>Bid Range:</strong> ₹{assignment.min_bid} - ₹{assignment.max_bid}</p>
              <p><strong>College/School:</strong> {assignment.college_or_school}</p>
              <p><strong>Distance:</strong> {assignment.distance.toFixed(1)} km</p>
              <p><strong>Locations:</strong></p>
              <ul>
                {assignment.locations.map((location, index) => (
                  <li key={index}>{location.name}</li>
                ))}
              </ul>
              <button
                className="place-bid-btn"
                onClick={() => navigate(`/place-bid/${assignment.id}`)}
              >
                Place Your Bid
              </button>
            </div>
          ))
        ) : (
          <p className="no-assignments">No assignments available nearby.</p>
        )}
      </div>

      {hasMore && assignments.length > 0 && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Assignments
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaceBid;