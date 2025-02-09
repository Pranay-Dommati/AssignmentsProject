import React, { useState, useEffect } from 'react';
import '../styles/assignment.css';
import LocationSearch from './LocationSearch'; // Import the LocationSearch component

function AddAssignment() {
  const [formData, setFormData] = useState({
    subject: '',
    numPages: '',
    email: '',
    collegeOrSchool: '',
    locations: [],
    minBid: '',
    maxBid: '',
    resourceFile: null, // New field for resource file
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/me/', {
          credentials: 'include', // Include cookies for session authentication
        });
        if (response.ok) {
          const data = await response.json();
          setFormData((prevFormData) => ({
            ...prevFormData,
            email: data.email,
            collegeOrSchool: data.college_name,
          }));
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resourceFile: e.target.files[0],
    });
  };

  const handleLocationSelect = (location) => {
    if (formData.locations.length < 5) {
      setFormData({
        ...formData,
        locations: [...formData.locations, location],
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.numPages || isNaN(formData.numPages)) newErrors.numPages = 'Valid number of pages is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.collegeOrSchool) newErrors.collegeOrSchool = 'College/School name is required';
    if (formData.locations.length === 0) newErrors.locations = 'At least one location is required'; 
    if (!formData.minBid || isNaN(formData.minBid)) newErrors.minBid = 'Valid minimum bid is required';
    if (!formData.maxBid || isNaN(formData.maxBid)) newErrors.maxBid = 'Valid maximum bid is required';
    if (!formData.resourceFile) newErrors.resourceFile = 'Resource file is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    if (validateForm()) {
        console.log('Form is valid');
        setIsSubmitting(true);
        const formDataToSend = new FormData();
        
        // Map the form fields to match the backend model
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('num_pages', formData.numPages);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('college_or_school', formData.collegeOrSchool);
        formDataToSend.append('locations', JSON.stringify(formData.locations));
        formDataToSend.append('min_bid', formData.minBid);
        formDataToSend.append('max_bid', formData.maxBid);
        formDataToSend.append('resource_file', formData.resourceFile);

        const csrftoken = getCookie('csrftoken');

        try {
            console.log('Sending form data:');
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            const response = await fetch('http://localhost:8000/api/assignments/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                setIsSubmitting(false);
                setShowConfirmation(true);
            } else {
                const data = await response.json();
                console.error('Error response:', data);
                setErrors({ api: JSON.stringify(data) });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setErrors({ api: 'An error occurred. Please try again.' });
            setIsSubmitting(false);
        }
    } else {
        console.log('Form is invalid');
    }
};

  const closeModal = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="add-assignment-container">
      <div className="form-container">
        <h2>Add Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Assignment Subject</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="form-control" />
            {errors.subject && <small className="error-text">{errors.subject}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="numPages">Number of Pages</label>
            <input type="number" id="numPages" name="numPages" value={formData.numPages} onChange={handleChange} className="form-control" />
            {errors.numPages && <small className="error-text">{errors.numPages}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="collegeOrSchool">College/School Name</label>
            <input type="text" id="collegeOrSchool" name="collegeOrSchool" value={formData.collegeOrSchool} onChange={handleChange} className="form-control" />
            {errors.collegeOrSchool && <small className="error-text">{errors.collegeOrSchool}</small>}
          </div>

          <div className="form-group">
            <label>Pickup Location(s) (Min 1, Max 5)</label>
            {formData.locations.map((location, index) => (
              <div key={index} className="selected-location">
                {location.name}
              </div>
            ))}
            {formData.locations.length < 5 && <LocationSearch onSelectLocation={handleLocationSelect} />}
            {errors.locations && <small className="error-text">{errors.locations}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="minBid">Minimum Bid Price</label>
            <input type="number" id="minBid" name="minBid" value={formData.minBid} onChange={handleChange} className="form-control" />
            {errors.minBid && <small className="error-text">{errors.minBid}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="maxBid">Maximum Bid Price</label>
            <input type="number" id="maxBid" name="maxBid" value={formData.maxBid} onChange={handleChange} className="form-control" />
            {errors.maxBid && <small className="error-text">{errors.maxBid}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="resourceFile">Resource File (PDF)</label>
            <input type="file" id="resourceFile" name="resourceFile" accept="application/pdf" onChange={handleFileChange} className="form-control" />
            {errors.resourceFile && <small className="error-text">{errors.resourceFile}</small>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      </div>

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <p>Assignment submitted successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddAssignment;