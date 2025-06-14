// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
// Importar useHistory se você quiser que o AuthProvider tenha a responsabilidade de redirecionar
// import { useHistory } from 'react-router-dom'; // Descomente esta linha se usar useHistory aqui

// Criação do contexto
export const AuthContext = createContext();

// Provedor de autenticação
// O `Maps` será a função de redirecionamento (useHistory ou useNavigate)
export const AuthProvider = ({ children, navigate }) => { // Recebe 'navigate' como prop
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Se você optar por usar useHistory/useNavigate diretamente no AuthProvider:
  // const history = useHistory(); // ou const navigate = useNavigate();

  // Função de login: salva o token e configura o header global
  const login = (newToken) => {
    localStorage.setItem("userToken", newToken);
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    // Opcional: Redirecionar após o login, se esta lógica for aqui
    if (navigate) {
        navigate('/admin/dashboard'); // Exemplo de redirecionamento após login
    }
  };

  // Função de logout: limpa o token e o header
  const logout = () => {
    console.log("Logout concluído");
    localStorage.removeItem("userToken");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    // Redirecionar para o login após o logout
    if (navigate) {
        navigate('/login');
    }
  };

  // Efeito para restaurar token salvo no localStorage e configurar interceptor
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    // --- Configuração do Interceptor de Resposta do Axios ---
    const interceptor = axios.interceptors.response.use(
      response => response, // Se a resposta for sucesso, apenas retorna
      error => {
        // Se o erro for uma resposta 401 (Não Autorizado) e há uma URL de resposta
        if (error.response && error.response.status === 401) {
          console.log('Token expirado ou não autorizado. Redirecionando para login...');
          logout(); // Chama a função de logout para limpar o token
        }
        return Promise.reject(error); // Rejeita a promessa para que o .catch() original seja chamado
      }
    );

    setLoading(false); // Após restaurar o estado e configurar o interceptor, loading é falso

    // Função de limpeza para remover o interceptor quando o componente é desmontado
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]); // Adicione 'navigate' como dependência para garantir que o interceptor seja recriado se mudar

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  navigate: PropTypes.func, // 'navigate' agora é uma prop opcional de função
};