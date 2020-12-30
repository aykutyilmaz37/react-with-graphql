import { createContext } from "react";

const AuthContext = createContext({
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
});

export default AuthContext;
