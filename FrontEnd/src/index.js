import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "views/Login.js";
import AdminLayout from "layouts/Admin.js";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import RedirectFromRoot from "components/RedirectFromRoot";

import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./assets/css/light-bootstrap-dashboard-react.css";
import "./assets/css/light-bootstrap-dashboard-react.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/admin" component={AdminLayout} />
        <Route exact path="/" component={RedirectFromRoot} />
      </Switch>
    </AuthProvider>
  </BrowserRouter>
);
