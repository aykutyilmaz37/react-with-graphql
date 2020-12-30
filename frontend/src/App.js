import React, { Fragment, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./helpers/private-route";
import "./App.scss";

import Navbar from "./components/Navigation/Navbar";
import AuthContext from "./context/auth-context";

import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Orders from "./pages/Orders";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };
  return (
    <Fragment>
      <BrowserRouter>
        <AuthContext.Provider
          value={{ token: token, userId: userId, login: login, logout: logout }}
        >
          <Navbar />
         
          <main className="main-content">
            <Switch>
              <PrivateRoute exact path="/" />
              <PrivateRoute path="/orders" component={Orders} />
              <Route path="/auth" component={Auth} />
              <Route path="/events" component={Events} />
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
