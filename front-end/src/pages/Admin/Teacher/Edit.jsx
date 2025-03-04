import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import PropTypes from "prop-types";

const Edit = ({ teacher, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: teacher?.user?.name || "",
    email: teacher?.user?.email || "",
    gender: teacher?.user?.gender || "",
    age: teacher?.user?.age || "",
    no_tlp: teacher?.user?.no_tlp || "",
    department_id: teacher?.department_id || "",
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
        setErrors(error.response.data.errors);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await axios.put(`http://localhost:8000/api/teachers/${teacher.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none" disabled />
        </div>
        <div>
          <label className="font-medium">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none">
            <option value="">Pilih Gender</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender[0]}</p>}
        </div>
        <div>
          <label className="font-medium">Telephone</label>
          <input type="text" name="no_tlp" value={formData.no_tlp} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none" />
          {errors.no_tlp && <p className="text-red-500 text-sm">{errors.no_tlp[0]}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium">Department</label>
          <select name="department_id" value={formData.department_id} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none">
            <option value="">Pilih Departemen</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </select>
          {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id[0]}</p>}
        </div>
        <div>
          <label className="font-medium">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light border border-orange-500/[0.5] focus:outline-none" min="18" />
          {errors.age && <p className="text-red-500 text-sm">{errors.age[0]}</p>}
        </div>
      </div>
      
      <div className="w-1/2">
        <button className="bg-orange-400 py-1.5 rounded-lg text-white px-4 cursor-pointer font-medium">Update</button>
      </div>
    </form>
  );
};

Edit.propTypes = {
  teacher: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Edit;
