import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const EditClass = ({ classId, onSuccess }) => {
  const [formData, setFormData] = useState({
    class_name: "",
    department_id: "",
    homeroom_teacher_id: "",
    max_students: "",
    grade_level: "",
    academic_year: "",
  });

  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!classId) return;

    axios
      .get(`http://localhost:8000/api/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const classData = response.data.data;
        setFormData({
          class_name: classData.class_name || "",
          department_id: classData.department?.id || "",
          homeroom_teacher_id: classData.homeroom_teacher?.id || "",
          max_students: classData.max_students || "",
          grade_level: classData.grade_level || "",
          academic_year: classData.academic_year?.year || "",
        });
      })
      .catch((error) => console.error("Error fetching class details:", error));

    axios
      .get("http://localhost:8000/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDepartments(response.data.data))
      .catch((error) => console.error("Error fetching departments:", error));

    axios
      .get("http://localhost:8000/api/available-homeroom", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTeachers(response.data.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, [classId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/api/classes/${classId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      });
  };
console.log(teachers);

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <div>
        <label className="font-medium block">Class Name</label>
        <input
          type="text"
          name="class_name"
          value={formData.class_name}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        />
      </div>

      <div>
        <label className="font-medium block">Academic Year</label>
        <input
          type="text"
          name="academic_year"
          value={formData.academic_year}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        />
      </div>

      <div>
        <label className="font-medium block">Department</label>
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.department_name}
            </option>
          ))}
        </select>
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
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium block">Max Students</label>
        <input
          type="number"
          name="max_students"
          value={formData.max_students}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        />
      </div>

      <div>
        <label className="font-medium block">Grade Level</label>
        <input
          type="number"
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        />
      </div>

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-4 rounded-lg mt-4 w-full cursor-pointer"
      >
        Update Class
      </button>
    </form>
  );
};

EditClass.propTypes = {
  classId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EditClass;
