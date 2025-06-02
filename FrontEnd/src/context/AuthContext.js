import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Carrega o token se já existir (opcional)
  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('userToken', newToken); // opcional, para persistência
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
