import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { router } from "./Router";
import './index.css';
import NotificationComponent from "./components/NotificationComponent";

function App() {
  return (
    <>
      <AuthProvider>
        <NotificationComponent />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
