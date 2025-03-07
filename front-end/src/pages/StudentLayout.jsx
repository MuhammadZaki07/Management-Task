import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Admin/Navbar"
import LinkSidebar from "../components/Admin/LinkSidebar"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StudentLayout = () => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if(user === null){
    return (
      <p className="hidden">Loading...</p>
    )
  }
  if (!user || user.role !== "student") {
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
          link="student-layout/dashboard"
          logo="bi bi-columns-gap"
          label="Dashboard"
        />
        <LinkSidebar
          link="student-layout/data-ptk"
          logo="bi bi-people-fill"
          label="Data PTK"
        />
        <LinkSidebar
          link="student-layout/assessment"
          logo="bi bi-journal-text"
          label="assessment"
        />
        <LinkSidebar
          link="student-layout/task"
          logo="bi bi-memory"
          label="Task"
          showBadge={true}
          left={`left-26`}
          top={`top-2`}
        />
        <LinkSidebar
          link="logout"
          logo="bi bi-box-arrow-left"
          label="Log-out"
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
  )
}

export default StudentLayout