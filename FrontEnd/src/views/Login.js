import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/loginView.css';
import fetchWrapper from 'utils/fetchWrapper';

const LoginView = () => {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Separate states for username and password errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState(''); // For other general errors
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Limpar token anterior
    localStorage.removeItem("userToken");

    // Clear all previous errors before a new attempt
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');
    setLoading(true);

    let hasError = false;

    // --- Client-side validation ---
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      console.log("Login response:", data);
  
      if (response.ok) {
        // Se login for bem-sucedido, salvar token e redirecionar
        localStorage.setItem('userToken', data.token);
        window.location.href = '/admin/dashboard'; 
      } else {
        // Tratar erros específicos retornados pela API
        setGeneralError(data.message || 'Login failed. Please check your credentials and try again.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logobase-1.png" alt="Fixit Logo" className="login-logo" />

        {/* Display general errors at the top if any */}
        {generalError && <p className="error-message top-error">{generalError}</p>}

        <form onSubmit={handleLogin}>
        <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Insert username"
              // Ensure THIS line starts with a proper backtick (`)
              className={`input-field ${usernameError ? 'input-error-border' : ''}`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(''); // Clear error when user starts typing
              }}
              disabled={loading}
            /> {/* THIS is where the tag should close */}
            {/* Display username specific error */}
            {usernameError && <p className="error-message field-error">{usernameError}</p>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password" // Add ID for label association
              type="password"
              placeholder="Insert password"
              // ALL attributes must be WITHIN the <input ... /> tag
              className={`input-field ${passwordError ? 'input-error-border' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(''); // Clear error when user starts typing
              }}
              disabled={loading}
            /> {/* THIS is where the tag should close */}
            {/* Display password specific error */}
            {passwordError && <p className="error-message field-error">{passwordError}</p>}
          </div>

          <a href="#" className="forgot-password">
            Forgot password?
          </a>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;