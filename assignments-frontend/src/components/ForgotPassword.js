import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; // Ensure styles exist

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors = {};
    if (!otp || otp !== generatedOtp) newErrors.otp = 'Invalid OTP';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    if (validateEmail()) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.email === email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        console.log(`OTP sent to ${email}: ${otp}`); // Simulate sending OTP
        setStep(2);
      } else {
        setErrors({ email: 'Email not found' });
      }
    }
  };

  const handleVerifyOtp = () => {
    if (validateOtp()) {
      setStep(3);
    }
  };

  const handleResetPassword = () => {
    if (validateNewPassword()) {
      const user = JSON.parse(localStorage.getItem('user'));
      user.password = newPassword;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('loggedIn', 'true');
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2>Forgot Password</h2>
        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="form-control"
                placeholder="Enter your email"
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>
            <button onClick={handleSendOtp} className="btn btn-primary">
              Send OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                className="form-control"
                placeholder="Enter the OTP sent to your email"
              />
              {errors.otp && <small className="error-text">{errors.otp}</small>}
            </div>
            <button onClick={handleVerifyOtp} className="btn btn-primary">
              Verify OTP
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="form-control"
                placeholder="Enter your new password"
              />
              {errors.newPassword && <small className="error-text">{errors.newPassword}</small>}
            </div>
            <button onClick={handleResetPassword} className="btn btn-primary">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;