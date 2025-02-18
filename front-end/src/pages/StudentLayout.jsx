import { Outlet } from "react-router-dom"
import Navbar from "../components/Admin/Navbar"
import LinkSidebar from "../components/Admin/LinkSidebar"

const StudentLayout = () => {
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
          link="dashboard"
          logo="bi bi-columns-gap"
          label="Dashboard"
        />
        <LinkSidebar
          link="data-ptk"
          logo="bi bi-people-fill"
          label="Data PTK"
        />
        <LinkSidebar
          link="timetable"
          logo="bi bi-table"
          label="Lesson timetable"
        />
        <LinkSidebar
          link="assessment"
          logo="bi bi-journal-text"
          label="assessment"
        />
        <LinkSidebar
          link="shared-storage"
          logo="bi bi-memory"
          label="Shared storage"
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