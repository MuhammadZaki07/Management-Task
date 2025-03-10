import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setErrors({}); // Reset errors before sending request

    try {
      const response = await axios.post("/api/login", formData, {
        headers: { Accept: "application/json" },
      });

      const data = response.data.data;
      setToken(data.token);
      localStorage.setItem("token", data.token);

      const redirectPath =
        {
          admin: "/admin-layout/dashboard",
          teacher: "/teacher-layout/dashboard",
          student: "/student-layout/dashboard",
        }[data.user.role] || "/";
      navigate(redirectPath);
    } catch (error) {
      if (error.response) {
        console.error("Login Error:", error.response.data);
        setErrors(error.response.data.errors || { general: "Incorrect email or password." });
      } else {
        console.error("Network Error:", error.message);
        setErrors({ general: "Network error. Please check your connection." });
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen px-5 lg:px-56">
      <div className="w-full lg:border border-slate-400/[0.5] lg:bg-white rounded-xl flex justify-between gap-20 lg:px-20 px-5 py-10">
        <div className="w-full lg:flex items-center flex-col hidden">
          <img src="/assets/Auth.png" alt="Auth" />
        </div>
        <div className="w-full flex items-center">
          <form onSubmit={formSubmit} className="flex flex-col gap-5 w-full">
            <div className="space-y-6">
              <div className="flex gap-5">
                <img src="/assets/logoblack.png" className="w-20" alt="logo" />
                <h1 className="font-bold font-gummy text-6xl text-center lg:text-left">
                  Login
                </h1>
              </div>
            </div>
            <div className="row">
              <label htmlFor="email" className="font-gummy text-light text-lg">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                autoComplete="username"
                className="block w-full rounded-lg border border-slate-300/[0.5] text-slate-500 font-normal bg-white lg:py-4 py-2.5 px-5 text-lg focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-3">{errors.email}</p>
              )}
            </div>
            <div className="row relative">
              <label htmlFor="password" className="font-gummy text-light text-lg">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  autoComplete="current-password"
                  className="block w-full rounded-lg border border-slate-300/[0.5] text-slate-500 font-normal bg-white lg:py-4 py-2.5 px-5 focus:outline-none pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-3">{errors.password}</p>
              )}
            </div>
            {errors.general && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {errors.general}
              </p>
            )}
            <button
              type="submit"
              className="w-1/2 mx-auto bg-amber-300 py-3 rounded-lg text-white text-xl hover:bg-amber-500 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
