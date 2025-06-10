// src/routes/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'; // Make sure PropTypes is imported
import { AuthContext } from '../context/AuthContext'; // Adjust path if necessary

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token, loading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontSize: '20px',
              color: '#333'
            }}>
              Verificando sessão...
            </div>
          );
        }

        if (token) {
          return <Component {...props} />;
        } else {
          // Add location to propTypes validation
          return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
        }
      }}
    />
  );
};

// Add PropTypes for the component and location
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  // Add location to propTypes validation as it's passed in the render prop
  location: PropTypes.object // location is an object from react-router-dom
};

export default PrivateRoute;