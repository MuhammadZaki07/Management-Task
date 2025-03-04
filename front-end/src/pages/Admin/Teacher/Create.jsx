import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Create = ({ onSuccess, modalState }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    gender: "",
    age: "",
    no_tlp: "",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/departments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (modalState.mode === "create") {
        await axios.post("http://localhost:8000/api/teachers", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onSuccess();
        navigate("/admin-layout/teachers");
      } else if (modalState.mode === "create-import") {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:8000/api/import-teachers", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        onSuccess();
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <form className="flex flex-col gap-5 py-5" onSubmit={handleSubmit}>
      {modalState.mode === "create" ? (
        <>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email[0]}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Teacher Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password[0]}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
              >
                <option value="">Pilih Gender</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender[0]}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Telephone</label>
              <input
                type="text"
                name="no_tlp"
                value={formData.no_tlp}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Enter phone number"
              />
              {errors.no_tlp && (
                <p className="text-red-500 text-sm">{errors.no_tlp[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-medium">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
              >
                <option value="">Pilih Departemen</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id[0]}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
                placeholder="Enter age"
                min="18"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age[0]}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <label className="font-medium">Import File:</label>
          <input
            type="file"
            name="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="w-full py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none"
          />
          {errors.file && (
            <p className="text-red-500 text-sm">{errors.file[0]}</p>
          )}
        </div>
      )}

      <div className="w-1/2 mt-5">
        <button
          type="submit"
          className="bg-orange-400 py-1.5 rounded-lg text-white px-4 cursor-pointer font-medium"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

Create.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  modalState: PropTypes.object.isRequired,
};

export default Create;
