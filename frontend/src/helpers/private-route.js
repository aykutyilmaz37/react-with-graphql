import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/auth-context";

const PrivateRoute = ({ component: Component }) => {
  const context = useContext(AuthContext);
  return (
    <Route
      render={(props) =>
        context.token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;
