import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../assets/css/loginView.css';

const LoginView = () => {
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');
    setLoading(true);

    let hasError = false;
    if (!username) {
      setUsernameError('Username is required.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {

      delete axios.defaults.headers.common["Authorization"];

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      const { token } = response.data;

      if (token) {
        console.log("Token recebido:", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        login(token); 
        history.push("/admin/dashboard");
      } else {
        setGeneralError('Login failed: token not received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError('Unexpected error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logobase-1.png" alt="Fixit Logo" className="login-logo" />
        {generalError && <p className="error-message top-error">{generalError}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Insert username"
              className={`input-field ${usernameError ? 'input-error-border' : ''}`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError('');
              }}
              disabled={loading}
            />
            {usernameError && <p className="error-message field-error">{usernameError}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Insert password"
              className={`input-field ${passwordError ? 'input-error-border' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              disabled={loading}
            />
            {passwordError && <p className="error-message field-error">{passwordError}</p>}
          </div>

          <a href="#" className="forgot-password">Forgot password?</a>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging In...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
