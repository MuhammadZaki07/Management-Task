import LinkSidebar from "../components/Admin/LinkSidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Admin/Navbar";

const TeacherLayout = () => {
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
            link="teacher-layout/dashboard"
            logo="bi bi-columns-gap"
            label="Dashboard"
          />
          <LinkSidebar link="teacher-layout/task" logo="bi bi-list-task" label="Task" />
          <LinkSidebar
            link="teacher-layout/schedule"
            logo="bi bi-layout-text-sidebar-reverse"
            label="Schedule"
          />
          <LinkSidebar
            link="teacher-layout/announcement"
            logo="bi bi-envelope-fill"
            label="announcement"
          />
          <LinkSidebar
            link="teacher-layout/notification"
            logo="bi bi-bell-fill"
            label="Notification"
            showBadge={true}
            left={`left-8`}
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
  );
};

export default TeacherLayout;
