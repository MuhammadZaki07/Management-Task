import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const Create = ({ onClose, refreshData }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sentToType: "role",
    sentToValue: "all",
    selectedClass: "",
    selectedUser: "",
    selectedRole: "",
  });

  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // Fetch classes and teachers when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get("http://localhost:8000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(classRes.data.data);

        const teacherRes = await axios.get("http://localhost:8000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(teacherRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Fetch students when a class is selected
  useEffect(() => {
    if (formData.selectedRole === "student" && formData.selectedClass) {
      const fetchStudents = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/students?class=${formData.selectedClass}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudents(res.data.data);
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      };
      fetchStudents();
    }
  }, [formData.selectedClass, formData.selectedRole, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title cannot be empty.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    if (!formData.sentToValue.trim() && formData.sentToType !== "role") newErrors.sentToValue = "Recipient must be selected.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let sentTo;
    if (formData.sentToType === "role") {
      sentTo = { role: formData.sentToValue };
    } else if (formData.sentToType === "users") {
      sentTo = { users: [Number(formData.selectedUser)] };
    } else if (formData.sentToType === "class") {
      sentTo = { class: formData.selectedClass };
    }

    const requestData = {
      title: formData.title,
      message: formData.message,
      sent_to: sentTo,
    };

    try {
      await axios.post("http://localhost:8000/api/announcements", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshData();
      onClose();
    } catch (error) {
      console.error("Failed to send announcement:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label className="font-semibold">Title</label>
      <input
        type="text"
        name="title"
        className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        placeholder="Announcement Title"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <p className="text-red-500">{errors.title}</p>}

      <label className="font-semibold">Message</label>
      <textarea
        name="message"
        rows={5}
        placeholder="Announcement Content"
        className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
        value={formData.message}
        onChange={handleChange}
      />
      {errors.message && <p className="text-red-500">{errors.message}</p>}

      <label className="font-semibold">Send To</label>
      <select name="sentToType" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" value={formData.sentToType} onChange={handleChange}>
        <option value="role">Role (Admin/Teacher/Student/All)</option>
        <option value="users">Individual (Teacher/Student)</option>
        <option value="class">Specific Class</option>
      </select>

      {formData.sentToType === "role" && (
        <select name="sentToValue" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" value={formData.sentToValue} onChange={handleChange}>
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      )}

      {formData.sentToType === "users" && (
        <>
          <select name="selectedRole" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" onChange={handleChange}>
            <option value="">Select</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {formData.selectedRole === "student" && (
            <>
              <select name="selectedClass" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" onChange={handleChange}>
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                ))}
              </select>

              {formData.selectedClass && (
                <select name="selectedUser" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" onChange={handleChange}>
                  <option value="">Select Student</option>
                  {students.map((stu) => (
                    <option key={stu.user_id} value={stu.user_id}>{stu.user.name}</option>
                  ))}
                </select>
              )}
            </>
          )}

          {formData.selectedRole === "teacher" && (
            <select name="selectedUser" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" onChange={handleChange}>
              <option value="">Select Teacher</option>
              {teachers.map((tch) => (
                <option key={tch.user_id} value={tch.user_id}>{tch.user.name}</option>
              ))}
            </select>
          )}
        </>
      )}

      {formData.sentToType === "class" && (
        <select name="selectedClass" className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500" onChange={handleChange}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.class_name}</option>
          ))}
        </select>
      )}

      <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 cursor-pointer">Send</button>
    </form>
  );
};

Create.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default Create;
