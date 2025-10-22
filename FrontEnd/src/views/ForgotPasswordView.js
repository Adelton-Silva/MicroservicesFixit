import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/loginView.css'; 

const ForgotPasswordView = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/account/forgot-password', { email }); // endpoint correto
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logobase-1.png" alt="Fixit Logo" className="login-logo" />
        {submitted ? (
          <p className="success-message">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={handleResetRequest}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">Enter your email</label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordView;
