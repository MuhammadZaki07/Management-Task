import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Create = ({ onClose, refreshData, userRole }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sentToType: "role",
    sentToValue: userRole === "teacher" ? "student" : "all",
  });
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (formData.sentToType === "class" || formData.sentToType === "users") {
      axios
        .get("http://localhost:8000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setClasses(res.data.data))
        .catch((err) => console.error("Error fetching classes:", err));
    }
    if (formData.sentToType === "users") {
      axios
        .get("http://localhost:8000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTeachers(res.data.data))
        .catch((err) => console.error("Error fetching teachers:", err));
    }
  }, [formData.sentToType]);

  useEffect(() => {
    if (formData.sentToType === "users" && formData.sentToValue) {
      axios
        .get(
          `http://localhost:8000/api/students?class=${formData.sentToValue}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setStudents(res.data.data))
        .catch((err) => console.error("Error fetching students:", err));
    }
  }, [formData.sentToValue]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let sentTo = {};
    if (formData.sentToType === "class") {
      sentTo = { class: formData.sentToValue };
    } else if (formData.sentToType === "users") {
      sentTo = { users: [formData.sentToValue] };
    } else if (formData.sentToType === "role") {
      sentTo = { role: formData.sentToValue };
    } else if (formData.sentToType === "all_classes") {
      sentTo = { class: "all" };
    }
    try {
      await axios.post(
        "http://localhost:8000/api/announcements",
        { title: formData.title, message: formData.message, sent_to: sentTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshData();
      onClose();
    } catch (error) {
      console.error(
        "Failed to send announcement:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label className="font-semibold">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        placeholder="Enter title"
      />
      
      <label className="font-semibold">Message</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        placeholder="Enter message"
      />
      
      <label className="font-semibold">Send To</label>
      <select
        name="sentToType"
        value={formData.sentToType}
        onChange={handleChange}
        className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
      >
        <option value="role">Role (Teacher/Student)</option>
        <option value="users">Individual (Specific ID)</option>
        <option value="class">Specific Class</option>
        <option value="all_classes">All Classes</option>
      </select>
      {formData.sentToType === "role" && (
        <select
          name="sentToValue"
          value={formData.sentToValue}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        >
          {userRole === "teacher" ? (
            <>
              <option value="student">All Students</option>
              <option value="teacher">All Teachers</option>
            </>
          ) : (
            <option value="all">All</option>
          )}
        </select>
      )}
      {formData.sentToType === "class" && (
        <select
          name="sentToValue"
          value={formData.sentToValue}
          onChange={handleChange}
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>
      )}
      {formData.sentToType === "users" && (
        <>
          <select
            name="sentToValue"
            value={formData.sentToValue}
            onChange={handleChange}
            className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          >
            <option value="">Select Student/Teacher</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.user.email}
              </option>
            ))}
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.email}
              </option>
            ))}
          </select>
        </>
      )}
      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-4 rounded-lg cursor-pointer"
      >
        Send Announcement
      </button>
    </form>
  );
};

Create.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default Create;
