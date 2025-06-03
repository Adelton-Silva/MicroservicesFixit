// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";

// Criação do contexto
export const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <- Para controlar carregamento inicial

  // Função de login: salva o token e configura o header global
  const login = (newToken) => {
    localStorage.setItem("userToken", newToken);
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  // Função de logout: limpa o token e o header
  const logout = () => {
    console.log("Logout concluído");
    localStorage.removeItem("userToken");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
  };

  // Efeito para restaurar token salvo no localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false); // <- Após restaurar o estado, loading é falso
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
