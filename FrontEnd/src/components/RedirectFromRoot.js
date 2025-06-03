// src/components/RedirectFromRoot.js
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from 'context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

const RedirectFromRoot = () => {
  const { token } = useContext(AuthContext);

  if (token && !isTokenExpired(token)) {
    return <Redirect to="/admin/dashboard" />;
  }

  return <Redirect to="/login" />;
};

export default RedirectFromRoot;
