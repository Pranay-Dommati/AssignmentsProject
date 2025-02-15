// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('loggedIn', 'true');
//         localStorage.setItem('userId', data.user_id);
//         localStorage.setItem('email', data.user.email); // Add this line to store email
//         localStorage.setItem('user', JSON.stringify(data.user));
//         navigate('/profile');
//       } else {
//         const data = await response.json();
//         setErrors({ api: JSON.stringify(data) });
//       }
//     } catch (error) {
//       setErrors({ api: 'An error occurred. Please try again.' });
//     }
// };

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

//           {errors.api && <small className="error-text text-danger">{errors.api}</small>}

//           <button type="submit" className="btn btn-primary">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchCsrfToken = async () => {
      try {
        await fetch('http://localhost:8000/api/csrf/', {
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

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
      const csrftoken = getCookie('csrftoken');
      
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        const data = await response.json();
        setErrors({ api: JSON.stringify(data) });
      }
    } catch (error) {
      console.error('Login error:', error);
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