import { createContext } from "react";
export const AuthContext = createContext({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
});
