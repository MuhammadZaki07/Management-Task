import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SubmitTask = ({ taskId, studentId, assignments, classId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedClassId, setResolvedClassId] = useState(classId);

  useEffect(() => {
    const assignment = assignments.find(
      (assignment) => assignment.task_id === taskId && 
                      (assignment.student_id === null || assignment.student_id === studentId)
    );

    if (assignment) {
      setResolvedClassId(assignment.class_id);
    }
  }, [taskId, assignments, studentId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("student_id", studentId);
    formData.append("class_id", resolvedClassId);
    formData.append("submission_text", "");
    formData.append("task_file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/task-submissions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Success!", "Your task has been submitted.", "success");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError("Validation failed. Please check your input and try again.");
        } else {
          setError("Failed to submit the task. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      Swal.fire("Error!", "Failed to submit the task.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 py-5">
      <label htmlFor="task_file">
        Document <span className="text-xs text-red-500">*pdf</span>
      </label>
      <input
        type="file"
        name="task_file"
        className="bg-gray-100 w-full py-2 rounded-lg border border-slate-300/[0.5] focus:outline-none px-2"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 w-full rounded text-white py-2"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default SubmitTask;
