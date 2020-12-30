import React, { Fragment, useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import "../../assets/scss/Navbar.scss";
const Navbar = (props) => {
  const context = useContext(AuthContext);
  return (
    <Fragment>
      <header className="navbar">
        <div className="navbar__logo">
          <h1>React Auth with GraphQL</h1>
        </div>
        <nav className="navbar__items">
          <ul>
            {!context.token && (
              <li>
                <NavLink to="/auth">Authentication</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            {context.token && (
              <Fragment>
                <li>
                  <NavLink to="/orders">Orders</NavLink>
                </li>
                <li>
                  <button onClick={context.logout}>Logout</button>
                </li>
              </Fragment>
            )}
          </ul>
        </nav>
      </header>
      ;
    </Fragment>
  );
};

export default Navbar;
