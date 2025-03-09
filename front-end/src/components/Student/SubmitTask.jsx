import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SubmitTask = ({ taskId, studentId }) => {
  const [files, setFiles] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/assignments/${taskId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const submission = response.data.submissions.find(
          (sub) => sub.student_id === studentId
        );
        if (submission) {
          setSubmissionStatus(submission.status);
        }
      } catch (error) {
        console.error("Error fetching submission status:", error);
      }
    };

    fetchSubmissionStatus();
  }, [taskId, studentId]);

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
    setError(null);
  };

  const addFileInput = () => {
    setFiles([...files, null]);
  };

  const removeFileInput = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || files.some((file) => file === null)) {
      setError("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("assignment_id", taskId);
    formData.append("student_id", studentId);
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/assignments/${taskId}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire("Success!", "Task submitted successfully.", "success");
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      setError(error.response?.data?.message || "Failed to submit task.");
      Swal.fire("Error!", error.response?.data?.message || "Failed to submit task.", "error");
    }    
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this submission!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8000/api/assignments/${taskId}/delete`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          Swal.fire("Deleted!", "Your submission has been deleted.", "success");
          setSubmissionStatus(null);
        } catch (error) {
          Swal.fire("Error!", "Failed to delete submission.", error);
        }
      }
    });
  };

  return (
    <div className="w-full py-4">
      {submissionStatus && submissionStatus !== "success" && (
        <button
          onClick={handleDelete}
          className="mb-4 w-full bg-red-500 text-white rounded py-2 hover:bg-red-700 cursor-pointer"
        >
          Delete Submission
        </button>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="space-y-2 py-2 px-2">
          {files.map((file, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="file"
                className="w-full rounded-lg bg-white border border-slate-300/[0.5] focus:outline-none px-4 py-2 cursor-pointer"
                accept="application/pdf,image/*"
                onChange={(e) => handleFileChange(e, index)}
              />
              {files.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 text-lg cursor-pointer"
                  onClick={() => removeFileInput(index)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-sky-500 hover:underline cursor-pointer"
            onClick={addFileInput}
          >
            <i className="bi bi-plus-lg me-1"></i> Add File
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
};

SubmitTask.propTypes = {
  taskId: PropTypes.number.isRequired,
  studentId: PropTypes.number.isRequired,
};

export default SubmitTask;
