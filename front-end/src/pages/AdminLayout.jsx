import { Navigate, Outlet } from "react-router-dom";
import LinkSidebar from "./../components/Admin/LinkSidebar";
import Navbar from "../components/Admin/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const AdminLayout = () => {
  const { user, token } = useContext(AuthContext);
  const [hasUnread, setHasUnread] = useState(false);
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
  useEffect(() => {
    fetchNotifications();
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user === null) {
    return <div className="hidden">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-screen flex bg-slate-50">
      <div className="w-72 bg-[#f5f2f0] h-full relative z-50">
        <div className="flex items-center justify-start gap-5 py-4 px-8">
          <img src="/assets/logoSalt.png" className="w-14" alt="logo" />
          <h1 className="font-medium font-gummy text-5xl text-center text-salt tracking-wider">
            TMS
          </h1>
        </div>
        <div className="px-3 py-5 flex flex-col gap-5">
          <LinkSidebar
            link="admin-layout/dashboard"
            logo="bi bi-columns-gap"
            label="Dashboard"
          />
          <LinkSidebar
            link="admin-layout/teachers"
            logo="bi bi-person-workspace"
            label="Teachers"
          />
          <LinkSidebar
            link="admin-layout/students"
            logo="bi bi-person-lines-fill"
            label="Students"
          />
          <LinkSidebar
            link="admin-layout/user-all"
            logo="bi bi-people-fill"
            label="Admins"
          />
          <LinkSidebar
            link="admin-layout/class"
            logo="bi bi-buildings"
            label="Class"
          />
          <LinkSidebar
            link="admin-layout/lesson"
            logo="bi bi-journals"
            label="Lesson"
          />
          <LinkSidebar
            link="admin-layout/departement"
            logo="bi bi-building"
            label="Departement"
          />
          <LinkSidebar
            link="admin-layout/announcement"
            logo="bi bi-envelope-fill"
            label="announcement"
          />
          <LinkSidebar
            showBadge={hasUnread}
            left="left-8"
            top="top-2"
            link="admin-layout/notification"
            logo="bi bi-bell-fill"
            label="Notification"
          />
          <LinkSidebar
            link="admin-layout/profile"
            logo="bi bi-person-circle"
            label="Profile"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
