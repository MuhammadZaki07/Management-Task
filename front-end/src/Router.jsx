import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./pages/GuestLayout";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import AdminLayout from "./pages/AdminLayout";
import StudentLayout from "./pages/StudentLayout";
import Dashboard from "./pages/Admin/Dashboard";
import DashboardStudent from "./pages/Student/Dashboard";
import DataPtk from "./pages/Student/DataPtk";
import ScheduleTable from "./pages/Admin/schedule/Schedule";
import Assesment from "./pages/Student/Assessment";
import SharedStorage from "./pages/Student/SharedStorage";
import Teachers from "./pages/Admin/Teacher/Teachers";
import Student from "./pages/Admin/Student/Student";
import Class from "./pages/Admin/Class/Class";
import Task from "./pages/Admin/Task/Task";
import Lesson from "./pages/Admin/lesson/Lesson";
import Schedule from "./pages/Admin/schedule/Schedule";
import Profile from "./components/Profile";
import Departement from "./pages/Admin/Departement/Departement";
import Detailtask from "./pages/Admin/Task/Detailtask";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/teachers",
        element:<Teachers/>
      },
      {
        path:"/students",
        element:<Student/>
      },
      {
        path:"/class",
        element: <Class/>
      },
      {
        path:"/task",
        element:<Task/>
      },
      {
        path:"/lesson",
        element:<Lesson/>
      },
      {
        path:"/schedule",
        element: <Schedule/>
      },
      {
        path:"/profile",
        element: <Profile/>
      },
      {
        path:"/departement",
        element:<Departement/>
      },
      {
        path:"/detail-task",
        element:<Detailtask/>
      }
    ],
  },
  {
    path: "/",
    element: <StudentLayout />,
    children: [
      {
        path:"/dashboard",
        element:<DashboardStudent/>
      },
      {
        path:"/data-ptk",
        element:<DataPtk/>
      },
      {
        path:"/timetable",
        element:<ScheduleTable/>
      },
      {
        path:"/assessment",
        element:<Assesment/>
      },
      {
        path:"/shared-storage",
        element:<SharedStorage/>
      }
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
