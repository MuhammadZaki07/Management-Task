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
import Assesment from "./pages/Student/Assessment";
import TaskStudent from "./pages/Student/TaskStudent";
import Teachers from "./pages/Admin/Teacher/Teachers";
import Student from "./pages/Admin/Student/Student";
import Class from "./pages/Admin/Class/Class";
import Lesson from "./pages/Admin/lesson/Lesson";
import Profile from "./components/Profile";
import Departement from "./pages/Admin/Departement/Departement";
import Message from "./pages/Admin/message/Message";
import MessageTeacher from "./pages/Teacher/message/Message";
import TeacherLayout from "./pages/TeacherLayout";
import DashboardTeacher from "./pages/Teacher/Dashboard";
import Task from "./pages/Teacher/Task/Task";
import Detailtask from "./pages/Teacher/Task/Detailtask";
import Notification from "./pages/Teacher/Notification";
import NotificationAdmin from "./pages/Admin/message/Notifcation";
import DetailTask from "./pages/Student/DetailTask";
import Admin from "./pages/Admin/user/Admin";

export const router = createBrowserRouter([
  {
    path: "/admin-layout",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "teachers",
        element: <Teachers />,
      },
      {
        path: "students",
        element: <Student />,
      },
      {
        path: "class",
        element: <Class />,
      },
      {
        path: "lesson",
        element: <Lesson />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "departement",
        element: <Departement />,
      },
      {
        path: "announcement",
        element: <Message />,
      },
      {
        path: "notification",
        element: <NotificationAdmin />,
      },
      {
        path: "user-all",
        element: <Admin />,
      },
    ],
  },
  {
    path: "/student-layout",
    element: <StudentLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardStudent />,
      },
      {
        path: "data-ptk",
        element: <DataPtk />,
      },
      {
        path: "assessment",
        element: <Assesment />,
      },
      {
        path: "task/*",
        element: <TaskStudent />,
      },      
      {
        path: "detail-task",
        element: <DetailTask />,
      },      
    ],
  },
  {
    path: "/teacher-layout",
    element: <TeacherLayout />,
    children: [
      {
        path: "dashboard",
        element:<DashboardTeacher/>
      },
      {
        path:"task",
        element:<Task/>
      },
      {
        path:"detail-task/:id",
        element:<Detailtask/>
      },
      {
        path:"announcement",
        element:<MessageTeacher/>
      },
      {
        path:"notification",
        element:<Notification/>
      },
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
