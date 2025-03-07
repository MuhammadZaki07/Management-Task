import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = () => {
  const { setToken, setUser, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  const handleLogout = async () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda harus login kembali setelah logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          await axios.post(
            "http://localhost:8000/api/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const unreadNotifications = response.data.notifications.some(
        (notif) => notif.is_read === 0
      );
      setHasUnread(unreadNotifications);
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
    }
  };

  return (
    <div className="w-full py-7 items-center flex gap-15 justify-between px-16 border-b border-[#5b6087]/[0.1]">
      <div className="flex items-center gap-10">
        <h1 className="text-[#5b6087] font-medium text-xl">
          Dashboard{" "}
          {location.pathname === "/dashboard" ? "" : location.pathname}
        </h1>
      </div>
      <div className="flex gap-15">
        {user.role === "admin" && (
          <>
            <Link to={`lesson`}>
              <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-journal-plus"></i>
            </Link>
            <Link to={`profile`}>
              <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-person-circle"></i>
            </Link>
          </>
        )}
        <Link
          to={`${
            user.role !== "admin"
              ? "/teacher-layout/notification"
              : "/admin-layout/notification"
          }`}
          className="relative"
        >
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-bell-fill"></i>
          {hasUnread && (
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-0"></div>
          )}
        </Link>
        <button onClick={handleLogout} className="cursor-pointer">
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
