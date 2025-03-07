import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Create = ({ onSucces }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    gender: "",
    no_tlp: "",
    age: "",
  });

  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:8000/api/register", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setSuccessMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        gender: "",
        no_tlp: "",
        age: "",
      });

    onSucces();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="w-full py-5">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium block">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter name"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          >
            <option value="">Select Gender</option>
            <option value="L">Male</option>
            <option value="P">Female</option>
          </select>
          {errors.gender && <span className="text-red-500 text-sm">{errors.gender[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Phone Number</label>
          <input
            type="text"
            name="no_tlp"
            value={formData.no_tlp}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter phone number"
          />
          {errors.no_tlp && <span className="text-red-500 text-sm">{errors.no_tlp[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter age (optional)"
          />
          {errors.age && <span className="text-red-500 text-sm">{errors.age[0]}</span>}
        </div>

        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button
          type="submit"
          className="bg-orange-400 text-white py-2 px-4 rounded-lg mt-4 w-full"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
};

Create.propTypes = {
  onSucces: PropTypes.func,
};

export default Create;
