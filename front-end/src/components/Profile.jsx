import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    gender: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/getData", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data.user;
        setFormData({
          id: userData.id,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.no_tlp || "",
          gender: userData.gender || "",
          role: userData.role || "",
          password: "",
          password_confirmation: "",
        });
        setLoading(false);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch user data.", "error");
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [token]);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      Swal.fire("Error!", "User ID is missing!", "error");
      return;
    }

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      setErrors({ ...errors, password_confirmation: "Passwords do not match" });
      return;
    }

    setErrors({});
    setLoading(true);

    const updatedData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      ...(formData.password && {
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }),
    };

    try {
      await axios.put(
        `http://localhost:8000/api/user/update/${formData.id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      if (formData.password) {
        Swal.fire({
          title: "Password Change Detected!",
          text: "You will be logged out automatically.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.post(
                "http://localhost:8000/api/logout",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (error) {
              console.error("Logout API failed:", error);
            }

            localStorage.removeItem("token");
            window.location.href = "/login";
          } else {
            Swal.fire("Cancelled", "Your session remains active.", "info");
          }
        });
      } else {
        Swal.fire("Success!", "Profile updated successfully.", "success");
      }
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }

      Swal.fire("Error!", "Failed to update profile.", "error");
      console.error("Failed to update profile:", error);
    }
  };

  if (loading)
    return (
      <div className="px-16 py-10 flex gap-10 items-start">
        <div>
          <div
            className="w-72 rounded-lg bg-slate-300 animate-pulse h-72"
            alt="Profile"
          />
          <div className="bg-green-200 animate-pulse w-full h-3 rounded-lg mt-3"></div>
        </div>
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
          <div className="w-full bg-slate-200 rounded-lg h-9 gap-5"></div>
        </div>
      </div>
    );

  return (
    <div className="px-16 py-10 flex gap-10 items-start">
      <div>
        <img
          src="/admin/admincs.jpg"
          className="w-72 rounded-lg"
          alt="Profile"
        />
        <div className="bg-green-500 py-1.5 px-4 text-white font-light text-sm rounded-lg mt-3 text-center">
          {formData.role}
        </div>
      </div>
      <form className="w-full" onSubmit={handleUpdate}>
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
              />
            </div>
          </div>
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="L">Male</option>
                <option value="P">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Telephone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
              />
            </div>
          </div>
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={handleTogglePassword}
                >
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    } text-gray-500`}
                  ></i>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-lg font-normal">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500/[0.5] focus:outline-none"
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer"
                  onClick={handleToggleConfirmPassword}
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    } text-gray-500`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="py-2 px-4 text-white bg-orange-500 rounded-lg w-1/7 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
