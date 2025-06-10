import React from "react";
import { useLocation, NavLink, Link } from "react-router-dom"; // Ensure Link is imported

import { Nav } from "react-bootstrap";

import PropTypes from 'prop-types';

// If you're not using this logo, you can remove this line
// import logo from "assets/img/reactlogo.png";

function Sidebar({ color, image, routes }) {
  const location = useLocation(); // Still needed for the 'activeRoute' on the <li>
  
  // Keep activeRoute if it's adding classes to the <li> element,
  // but for NavLink's active state, we'll use 'end'.
  // The 'activeRoute' function itself is the culprit for the substring match.
  // If you want only NavLink to control the active state, you can remove this function entirely
  // and the 'className={activeRoute(...)}' from the <li>.
  const activeRoute = (routeName) => {
    // This logic is flawed for exact matching, and the 'NavLink end' prop is preferred.
    // However, if the template *requires* a class on the <li> based on a broader match,
    // you might need a more sophisticated 'activeRoute' or keep it as is if its only for styling
    // that is separate from NavLink's active state.
    // For now, let's assume NavLink's 'end' prop will handle the primary active state.
    // If you remove this function, also remove 'className={activeRoute(...)}' from the <li>.
    return location.pathname.startsWith(routeName) ? "active" : ""; // Slightly better: use startsWith
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
                  // If you want the 'active' class on the <li> based on exact match,
                  // you can change activeRoute to compare 'location.pathname === (prop.layout + prop.path)'.
                  // However, often the NavLink's activeClassName is sufficient.
                  className={activeRoute(prop.layout + prop.path)} // Consider if this is still needed or how it interacts
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    end // <--- THIS IS THE CRUCIAL ADDITION FOR EXACT MATCHING IN NavLink
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