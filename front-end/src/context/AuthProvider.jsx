import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);

  const getUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/api/getData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data.user;
      // console.log(data);
      
      if (response.status === 200) {
        setUser(data);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        setErrors(data.errors || { error: data.error });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, errors }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
