import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Create = ({ onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    class_name: "",
    department_id: "",
    homeroom_teacher_id: "",
    max_students: "",
    grade_level: "",
    academic_year: "",
  });
  
  useEffect(() => {
    axios.get("http://localhost:8000/api/departments", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setDepartments(response.data.data))
    .catch(error => console.error("Error fetching departments:", error));

    axios.get("http://localhost:8000/api/available-homeroom", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setTeachers(response.data.data))
    .catch(error => console.error("Error fetching teachers:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    axios.post("http://localhost:8000/api/classes", formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      onSuccess();
      console.log(response);
    })
    .catch(error => {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium block">Class Name</label>
          <input
            type="text"
            name="class_name"
            value={formData.class_name}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="Enter class name"
          />
          {errors.class_name && <span className="text-red-500 text-sm">{errors.class_name[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Academic Year</label>
          <input
            type="text"
            name="academic_year"
            value={formData.academic_year}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
            placeholder="e.g., 2024/2025"
          />
          {errors.academic_year && <span className="text-red-500 text-sm">{errors.academic_year[0]}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium block">Department</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.department_name}</option>
            ))}
          </select>
          {errors.department_id && <span className="text-red-500 text-sm">{errors.department_id[0]}</span>}
        </div>

        <div>
          <label className="font-medium block">Homeroom Teacher</label>
          <select
            name="homeroom_teacher_id"
            value={formData.homeroom_teacher_id}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          >
            <option value="">Select Homeroom Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.user.name}</option>
            ))}
          </select>
          {errors.homeroom_teacher_id && <span className="text-red-500 text-sm">{errors.homeroom_teacher_id[0]}</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
      <div>
        <label className="font-medium block">Grade Level</label>
        <input
          type="number"
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          placeholder="Grade"
        />
        {errors.grade_level && <span className="text-red-500 text-sm">{errors.grade_level[0]}</span>}
      </div>
      <div>
        <label className="font-medium block">Max Students</label>
        <input
          type="number"
          name="max_students"
          value={formData.max_students}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          placeholder="Enter max students"
        />
        {errors.max_students && <span className="text-red-500 text-sm">{errors.max_students[0]}</span>}
      </div>
      </div>

      <button type="submit" className="bg-orange-400 text-white py-2 px-4 rounded-lg mt-4 w-full cursor-pointer">
        Create Class
      </button>
    </form>
  );
};

Create.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Create;
