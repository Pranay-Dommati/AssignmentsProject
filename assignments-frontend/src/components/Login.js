// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles/auth.css'; // Ensure styles exist

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
//     if (!formData.password) newErrors.password = 'Password is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const user = JSON.parse(localStorage.getItem('user'));
//       if (user && user.email === formData.email && user.password === formData.password) {
//         localStorage.setItem('loggedIn', 'true');
//         navigate('/');
//       } else {
//         setErrors({ login: 'Invalid email or password' });
//       }
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="form-container">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter your email"
//             />
//             {errors.email && <small className="error-text">{errors.email}</small>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="Enter your password"
//             />
//             {errors.password && <small className="error-text">{errors.password}</small>}
//           </div>

//           {errors.login && <small className="error-text text-danger">{errors.login}</small>}

//           <button type="submit" className="btn btn-primary">
//             Login
//           </button>
//         </form>
//         <div className="forgot-password-link">
//           <Link to="/forgot-password">Forgot Password?</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; // Ensure styles exist

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', data.user_id);
        navigate('/');
      } else {
        const data = await response.json();
        setErrors({ api: JSON.stringify(data) });
      }
    } catch (error) {
      setErrors({ api: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2>Login</h2>
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

          {errors.api && <small className="error-text text-danger">{errors.api}</small>}

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;