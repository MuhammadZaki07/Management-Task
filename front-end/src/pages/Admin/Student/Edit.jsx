import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";

const EditStudent = ({ student, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: student?.user?.name || "",
    gender: student?.user?.gender || "",
    no_tlp: student?.user?.no_tlp || "",
    password: "",
    confirmPassword: "",
    department_id: student?.department_id || "",
    class_id: student?.class_id || "",
    age: student?.user?.age || "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchDepartments();
    fetchClasses();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset error saat input berubah
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.no_tlp.trim()) newErrors.no_tlp = "Telephone is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.department_id) newErrors.department_id = "Department is required";
    if (!formData.class_id) newErrors.class_id = "Class is required";

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8000/api/students/${student.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Student data updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update student data",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name & Gender */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="font-semibold">Gender</label>
          <select
            name="gender"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="L">Male</option>
            <option value="P">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>
      </div>

      {/* Phone Number & Age */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-semibold">Telephone</label>
          <input
            type="text"
            name="no_tlp"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.no_tlp}
            onChange={handleChange}
          />
          {errors.no_tlp && <p className="text-red-500 text-sm">{errors.no_tlp}</p>}
        </div>
        <div>
          <label className="font-semibold">Age</label>
          <input
            type="number"
            name="age"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="relative">
          <label className="font-semibold">Password</label>
          <input
            type={"password"}
            name="password"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <label className="font-semibold">Confirm Password</label>
          <input
            type={"password"}
            name="confirmPassword"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
      </div>

      {/* Department & Class */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-semibold">Department</label>
          <select
            name="department_id"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.department_id}
            onChange={handleChange}
          >
            <option value="">Choose Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id}</p>}
        </div>
        <div>
          <label className="font-semibold">Class</label>
          <select
            name="class_id"
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            value={formData.class_id}
            onChange={handleChange}
          >
            <option value="">Choose Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name}
              </option>
            ))}
          </select>
          {errors.class_id && <p className="text-red-500 text-sm">{errors.class_id}</p>}
        </div>
      </div>

      <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-lg cursor-pointer">
        Save Changes
      </button>
    </form>
  );
};

EditStudent.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      no_tlp: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
    }).isRequired,
    department_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    class_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};


export default EditStudent;
