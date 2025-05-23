import React from 'react';
import '../assets/css/loginView.css';

const LoginView = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logobase.jpg" alt="Fixit Logo" className="login-logo" />

        <div className="input-group">
          <label className="input-label">Username</label>
          <input
            type="text"
            placeholder="Insert username"
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            placeholder="Insert password"
            className="input-field"
          />
        </div>

        <a href="#" className="forgot-password">
          Forgot password?
        </a>

        <button className="login-button">Continue</button>
      </div>
    </div>
  );
};

export default LoginView;
