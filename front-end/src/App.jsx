import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { router } from "./Router";
import './index.css'

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
