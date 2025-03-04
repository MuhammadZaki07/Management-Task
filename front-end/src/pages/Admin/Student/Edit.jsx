import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const Edit = ({ student, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: student?.user?.name || "", // Mengakses name dalam objek user
    gender: student?.user?.gender || "", // Mengakses gender dalam objek user
    no_tlp: student?.user?.no_tlp || "", // Mengakses no_tlp dalam objek user
    department_id: student?.department_id || "", // department_id di tingkat student
    class_id: student?.class_id || "",
    age: student?.user?.age || "", // Mengakses age dalam objek user
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/students/${student.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Memperbarui formData dengan data yang diterima
        setFormData({
          name: response.data.data.user.name,
          gender: response.data.data.user.gender,
          no_tlp: response.data.data.user.no_tlp,
          department_id: response.data.data.department_id,
          class_id: response.data.data.class_id,
          age: response.data.data.user.age,
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/departments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(response.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchStudentData();
    fetchDepartments();
    fetchClasses();
  }, [student.id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/students/${student.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="department_id" className="font-semibold">
            Department
          </label>
          <select
            name="department_id"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
            value={formData.department_id}
            onChange={handleChange}
          >
            <option value="">Choose Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="gender" className="font-semibold">
            Gender
          </label>
          <select
            name="gender"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="L">Male</option>
            <option value="P">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="no_tlp" className="font-semibold">
            Telephone
          </label>
          <input
            type="text"
            name="no_tlp"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
            placeholder="No tlp"
            value={formData.no_tlp}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="class_id" className="font-semibold">
            Class
          </label>
          <select
            name="class_id"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
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
        </div>
        <div>
          <label htmlFor="age" className="font-semibold">
            Age
          </label>
          <input
            type="number"
            name="age"
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Save Changes
      </button>
    </form>
  );
};

Edit.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      no_tlp: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
    }).isRequired,
    department_id: PropTypes.number.isRequired,
    class_id: PropTypes.string,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Edit;
