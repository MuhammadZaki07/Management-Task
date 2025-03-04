import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      Swal.fire({
        title: "Loading...",
        text: "Fetching user data, please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await axios.get("http://localhost:8000/api/getData", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.no_tlp || "",
          age: userData.age || "",
          gender: userData.gender || "",
          role: userData.role || "",
        });

        Swal.close();
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch user data.", "error");
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleUpdate = async () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }
    
    setUpdating(true);
    setErrors({});

    try {
      await axios.put(
        "http://localhost:8000/api/user/update",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (formData.password) {
        localStorage.removeItem("token");
        Swal.fire("Password Changed!", "You have been logged out due to a password change.", "warning").then(() => {
          window.location.href = "/login";
        });
      } else {
        Swal.fire("Success!", "Profile updated successfully.", "success");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      Swal.fire("Error!", "Failed to update profile.", "error");
      console.error("Failed to update profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="px-16 py-10 flex gap-10 items-start">
      <div>
        <img src="/assets/profile.png" className="w-72 rounded-lg" alt="Profile" />
      </div>
      <form className="w-full">
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-lg font-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="text-lg font-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full relative">
              <label htmlFor="password" className="text-lg font-semibold">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="absolute right-3 top-12 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full relative">
              <label htmlFor="confirmPassword" className="text-lg font-semibold">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span className="absolute right-3 top-10 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
              </span>
              {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;