import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import PropTypes from "prop-types";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const getUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/api/getData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data.user;
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

  // 🔥 Tambahkan Pusher untuk menerima notifikasi real-time
  useEffect(() => {
    if (!user) return;

    // Inisialisasi Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      encrypted: true,
    });

    // Langganan ke channel notifikasi berdasarkan user ID
    const channel = pusher.subscribe(`notifications.${user.id}`);

    channel.bind("new-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, errors, notifications }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
