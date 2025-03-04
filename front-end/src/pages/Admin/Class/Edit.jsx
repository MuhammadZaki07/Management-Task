import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Edit = ({ classes, onSuccess }) => {
  const [formData, setFormData] = useState({
    class_name: "",
    department_id: "",
    homeroom_teacher_id: "",
    max_students: "",
    grade_level: "",
  });

  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Set form data from classes prop
    if (classes) {
      setFormData({
        class_name: classes.class_name,
        department_id: classes.department_id,
        homeroom_teacher_id: classes.homeroom_teacher_id,
        max_students: classes.max_students,
        grade_level: classes.grade_level,
      });
    }

    // Fetch departments and teachers
    axios
      .get(`http://localhost:8000/api/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setDepartments(response.data.data))
      .catch((error) => console.error("Error fetching departments:", error));

    axios
      .get(`http://localhost:8000/api/available-homeroom`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTeachers(response.data.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, [classes, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .put(`http://localhost:8000/api/classes/${classes.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Swal.fire("Updated!", "Class has been updated successfully.", "success");
        onSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="class_name" className="font-medium block">
            Class Name
          </label>
          <input
            type="text"
            name="class_name"
            value={formData.class_name}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
            placeholder="Enter class name"
          />
          {errors.class_name && (
            <span className="text-red-500 text-sm">{errors.class_name[0]}</span>
          )}
        </div>

        <div>
          <label htmlFor="department_id" className="font-medium block">
            Department
          </label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
          {errors.department_id && (
            <span className="text-red-500 text-sm">{errors.department_id[0]}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="homeroom_teacher_id" className="font-medium block">
            Homeroom Teacher
          </label>
          <select
            name="homeroom_teacher_id"
            value={formData.homeroom_teacher_id}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
          >
            <option value="">Select Homeroom Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.name}
              </option>
            ))}
          </select>
          {errors.homeroom_teacher_id && (
            <span className="text-red-500 text-sm">{errors.homeroom_teacher_id[0]}</span>
          )}
        </div>

        <div>
          <label htmlFor="max_students" className="font-medium block">
            Max Students
          </label>
          <input
            type="number"
            name="max_students"
            value={formData.max_students}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
            placeholder="Enter max students"
          />
          {errors.max_students && (
            <span className="text-red-500 text-sm">{errors.max_students[0]}</span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="grade_level" className="font-medium block">
          Grade Level
        </label>
        <input
          type="number"
          name="grade_level"
          value={formData.grade_level}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
          placeholder="Enter grade level"
        />
        {errors.grade_level && (
          <span className="text-red-500 text-sm">{errors.grade_level[0]}</span>
        )}
      </div>

      <div className="col-span-2">
        <button
          type="submit"
          className="bg-orange-400 text-white py-2 px-4 rounded-lg mt-4 w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Class"}
        </button>
      </div>
    </form>
  );
};

Edit.propTypes = {
  classes: PropTypes.shape({
    id: PropTypes.number.isRequired,
    class_name: PropTypes.string.isRequired,
    department_id: PropTypes.number.isRequired,
    homeroom_teacher_id: PropTypes.number.isRequired,
    max_students: PropTypes.number.isRequired,
    grade_level: PropTypes.number.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Edit;
