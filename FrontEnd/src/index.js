// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "views/Login.js";
import AdminLayout from "layouts/Admin.js";
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORTE jwt-decode

// ... (seus imports de CSS - certifique-se que estão corretos e não duplicados!)
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./assets/css/light-bootstrap-dashboard-react.css";
import "./assets/css/light-bootstrap-dashboard-react.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";


// Função auxiliar para verificar se o token JWT expirou
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    // 'exp' é o tempo de expiração em segundos desde a época Unix
    // Date.now() retorna milissegundos, então dividimos por 1000
    if (decoded.exp < Date.now() / 1000) {
      return true; // Token expirou
    }
    return false; // Token ainda válido
  } catch (error) {
    // Se a decodificação falhar (token inválido/corrompido), consideramos expirado
    console.error("Erro ao decodificar token ou token inválido:", error);
    return true;
  }
};


// Componente de rota protegida
const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("userToken");

  // VERIFICAÇÃO DUPLA: Existência E Validade
  const isAuthenticated = token !== null && !isTokenExpired(token);

  if (!isAuthenticated) {
    // Se não estiver autenticado (token não existe ou expirou),
    // remova o token (caso tenha sido um token expirado) e redirecione
    localStorage.removeItem("userToken");
    return <Redirect to="/login" />;
  }

  // Se estiver autenticado, renderize o componente
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  );
};


// Tipagem das props
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string,
};

// Renderização principal
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute path="/admin" component={AdminLayout} />
      <Route
        exact
        path="/"
        render={() =>
          // Verifique se o token existe E se não expirou
          // Use a mesma lógica do PrivateRoute para consistência
          localStorage.getItem("userToken") !== null && !isTokenExpired(localStorage.getItem("userToken")) ? (
            <Redirect to="/admin/dashboard" />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    </Switch>
  </BrowserRouter>
);