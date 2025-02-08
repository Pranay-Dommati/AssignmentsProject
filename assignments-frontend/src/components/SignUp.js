import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; // Ensure styles exist

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    college_name: '', // Update key to match backend
    mobile_number: '', // Update key to match backend
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.college_name) newErrors.college_name = 'College name is required';
    if (!formData.mobile_number || !/^\d{10}$/.test(formData.mobile_number)) newErrors.mobile_number = 'Valid 10-digit mobile number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('userId', data.id); // Ensure userId is stored
          localStorage.setItem('user', JSON.stringify(data)); // Store user data
          navigate('/profile');
        } else {
          const data = await response.json();
          setErrors({ api: JSON.stringify(data) }); // Convert the error object to a string
        }
      } catch (error) {
        setErrors({ api: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
            />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="college_name">College Name</label>
            <input
              type="text"
              id="college_name"
              name="college_name"
              value={formData.college_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your college name"
            />
            {errors.college_name && <small className="error-text">{errors.college_name}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your mobile number"
            />
            {errors.mobile_number && <small className="error-text">{errors.mobile_number}</small>}
          </div>

          {errors.api && <small className="error-text text-danger">{errors.api}</small>}

          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;