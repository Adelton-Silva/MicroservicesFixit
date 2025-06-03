import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));

  const login = (newToken) => {
    localStorage.setItem("userToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log("Logout concluido");
    localStorage.removeItem("userToken");
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
