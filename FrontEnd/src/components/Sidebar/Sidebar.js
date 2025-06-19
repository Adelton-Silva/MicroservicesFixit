import React from "react";
import { useLocation, NavLink, Link } from "react-router-dom"; // Ensure Link is imported

import { Nav } from "react-bootstrap";

import PropTypes from 'prop-types';


function Sidebar({ color, image, routes }) {
  const location = useLocation(); // Still needed for the 'activeRoute' on the <li>

  const activeRoute = (routeName) => {
  };

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")"
        }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <Link
            to="/admin/dashboard" // This is the target path for the logo and text
            className="simple-text logo-mini mx-1" // Keep classes for styling
          >
            <div className="logo-img">
              <img src="/logobase-1.png" alt="Logo" />
            </div>
          </Link>

          <Link to="/admin/dashboard" className="simple-text">
            FiXIT
          </Link>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            // Filter out redirect and upgrade routes
            if (!prop.redirect && !prop.upgrade) {
              return (
                <li
                  className={activeRoute(prop.layout + prop.path)} 
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    end 
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  color: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.string,
      layout: PropTypes.string,
      redirect: PropTypes.bool,
      upgrade: PropTypes.bool,
    })
  ).isRequired,
};

export default Sidebar;