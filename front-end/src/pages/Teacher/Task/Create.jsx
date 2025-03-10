import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Create = ({ onSuccess }) => {
  const [isDeadlineEnabled, setIsDeadlineEnabled] = useState(false);
  const [sentTo, setSentTo] = useState("class"); // Default "class"
  const [selectedMultiClasses, setSelectedMultiClasses] = useState([]);
  const [selectedSingleClass, setSelectedSingleClass] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [endDeadline, setEndDeadline] = useState("");
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const { token } = useContext(AuthContext);
  const [lessonId, setLessonId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setClasses(
          response.data.data.map((cls) => ({
            value: cls.id,
            label: cls.class_name,
          }))
        );
      });

    axios
      .get("http://localhost:8000/api/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLessonId(response.data.lesson_id);
      })
      .catch((error) => {
        console.error("Failed to fetch lesson_id", error);
      });
  }, [token]);

  useEffect(() => {
    if (selectedSingleClass) {
      axios
        .get(`http://localhost:8000/api/students?class_id=${selectedSingleClass.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setStudents(
            response.data.data.map((student) => ({
              value: student.id,
              label: student.user.name,
            }))
          );
        });
    }
  }, [selectedSingleClass, token]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]); // Konversi FileList ke array
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validationErrors = {};
    if (!taskName.trim()) validationErrors.taskName = "Task name is required";
    if (!taskDescription.trim()) validationErrors.taskDescription = "Task description is required";
    if (!lessonId) validationErrors.lessonId = "Lesson is required";
    if (isDeadlineEnabled && !endDeadline) validationErrors.deadline = "End deadline is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("lesson_id", lessonId);
    formData.append("title", taskName);
    formData.append("description", taskDescription);
    if (isDeadlineEnabled) formData.append("deadline", `${endDeadline} 23:59:59`);

    if (sentTo === "class") {
      selectedMultiClasses.forEach((cls) => formData.append("assign_to_classes[]", cls.value));
    }

    if (sentTo === "individual") {
      selectedStudents.forEach((student) => formData.append("assign_to_students[]", student.value));
    }

    files.forEach((file) => formData.append("files[]", file));

    try {
      await axios.post("http://localhost:8000/api/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Task Created!", text: "Task successfully created.", confirmButtonColor: "#3085d6" });
      onSuccess();
    } catch (error) {
      console.error("Error creating task", error);
      Swal.fire({ icon: "error", title: "Task Creation Failed", text: error.response?.data?.message || "Something went wrong.", confirmButtonColor: "#d33" });
    }
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-medium text-slate-700">Task Name</label>
          <input type="text" className="w-full bg-white py-2 px-4 rounded-lg border border-slate-300" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}
        </div>
        <div>
          <label className="font-medium text-slate-700">Documents</label>
          <input type="file" multiple className="w-full bg-white py-2 px-4 rounded-lg border border-slate-300" onChange={handleFileChange} />
        </div>
      </div>

      <div>
        <textarea className="w-full bg-white py-2 px-4 rounded-lg border border-slate-300" placeholder="Task Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></textarea>
        {errors.taskDescription && <p className="text-red-500 text-sm">{errors.taskDescription}</p>}
      </div>

      <div>
        <label className="font-medium text-slate-700">Send To</label>
        <select className="w-full bg-white py-2 px-4 rounded-lg border border-slate-300" value={sentTo} onChange={(e) => setSentTo(e.target.value)}>
          <option value="class">Classes</option>
          <option value="individual">Individual Student</option>
        </select>
      </div>

      {sentTo === "class" && <Select isMulti options={classes} onChange={setSelectedMultiClasses} />}
      {sentTo === "individual" && <Select options={classes} onChange={setSelectedSingleClass} />}
      {sentTo === "individual" && selectedSingleClass && <Select isMulti options={students} onChange={setSelectedStudents} />}

      <label className="font-medium text-slate-700 flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4" onChange={(e) => setIsDeadlineEnabled(e.target.checked)} /> Enable Deadline
      </label>

      {isDeadlineEnabled && (
        <div>
          <label className="font-medium text-slate-700">End Deadline</label>
          <input type="date" className="w-full py-2 px-4 rounded-lg border border-gray-300" value={endDeadline} min={new Date().toISOString().split("T")[0]} onChange={(e) => setEndDeadline(e.target.value)} />
        </div>
      )}

      <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all cursor-pointer">Submit</button>
    </form>
  );
};

Create.propTypes = { onSuccess: PropTypes.func };
export default Create;
