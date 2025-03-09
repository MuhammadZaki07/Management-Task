import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const TaskPending = ({ taskId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [isRevisionDisabled, setIsRevisionDisabled] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      if (!taskId) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/assignments/${taskId}/submissions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubmissions(response.data.submissions);

        const initialScores = {};
        const initialFeedbacks = {};
        const initialRevisionDisabled = {};
        const initialErrors = {};

        response.data.submissions.forEach((submission) => {
          initialScores[submission.id] = "";
          initialFeedbacks[submission.id] = "";
          initialRevisionDisabled[submission.id] = true;
          initialErrors[submission.id] = "";
        });

        setScores(initialScores);
        setFeedbacks(initialFeedbacks);
        setIsRevisionDisabled(initialRevisionDisabled);
        setErrors(initialErrors);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingSubmissions();
  }, [taskId]);

  const handleGradeSubmission = async (submissionId, status) => {
    if (scores[submissionId] === "") {
      setErrors((prev) => ({
        ...prev,
        [submissionId]: "Rating and feedback are required!",
      }));
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/submissions/${submissionId}/grade`,
        {
          score: scores[submissionId],
          feedback: feedbacks[submissionId],
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Submission updated successfully!",
      });
      setScores((prev) => ({ ...prev, [submissionId]: "" }));
      setFeedbacks((prev) => ({ ...prev, [submissionId]: "" }));
      setIsRevisionDisabled((prev) => ({ ...prev, [submissionId]: true }));
      setErrors((prev) => ({ ...prev, [submissionId]: "" }));
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  const handleScoreChange = (submissionId, value) => {
    const numericValue = value === "" ? "" : parseInt(value, 10) || 0;
    setScores((prev) => ({ ...prev, [submissionId]: numericValue }));

    setIsRevisionDisabled((prev) => ({
      ...prev,
      [submissionId]: numericValue === "" || numericValue >= 75,
    }));

    setErrors((prev) => ({ ...prev, [submissionId]: "" }));
  };

  const handleFeedbackChange = (submissionId, value) => {
    setFeedbacks((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleRevisionAction = async (submissionId, action) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/submissions/${submissionId}/handle-revision`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
    } catch (error) {
      console.error("Error:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data.message || "Something went wrong",
      });
    }
  };

  if (loading) return <p>Loading submissions...</p>;
  if (submissions.length === 0) return <p>No pending submissions.</p>;

  return (
    <div className="bg-white rounded-xl w-full p-6">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="flex flex-col md:flex-row items-center gap-6 border-b mb-2 border-gray-200"
        >
          <img
            src={
              submission.student.gender === "P"
                ? "/student/girl.png"
                : "/student/boy.png"
            }
            className="w-32 h-32 rounded-lg"
            alt="student-avatar"
          />
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-700">
              {submission.student?.user?.name || "Unknown Student"}
            </h1>
            <h3 className="text-sm text-gray-500">
              {submission.student?.class?.class_name || "-"} |{" "}
              {submission.student?.department?.department_name || "-"}
            </h3>
            <p className="text-gray-600 mt-2">
              {submission.submission_text || "No description provided."}
            </p>
            {submission.submission_file && (
              <a
                href={`http://localhost:8000/storage/${submission.submission_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Submission File
              </a>
            )}
          </div>
          {submission.status === "success" ? (
  <div className="p-4 border border-green-400 bg-green-100 rounded-lg">
    <p className="text-green-600 font-semibold">✅ This submission has been approved.</p>
    <p className="font-medium mt-2">📌 Current Status: <span className="text-green-500">Success</span></p>
    <p className="mt-2">📝 Score: <span className="font-semibold">{submission.score || "Not Graded"}</span></p>
    <p className="mt-1">💬 Feedback: <span className="italic">{submission.feedback || "No Feedback"}</span></p>
  </div>
) : submission.status === "revision" ? (
  <div className="p-4 border border-yellow-400 bg-yellow-100 rounded-lg">
    <p className="text-yellow-600 font-semibold">⚠️ Revision Requested</p>
    <p className="font-medium mt-2">📌 Current Status: <span className="text-yellow-500">Revision</span></p>
    <p className="mt-2">📝 Score: <span className="font-semibold">{submission.score || "Not Graded"}</span></p>
    <p className="mt-1">💬 Feedback: <span className="italic">{submission.feedback || "No Feedback"}</span></p>
    <div className="flex gap-3 mt-3">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 cursor-pointer"
        onClick={() => handleRevisionAction(submission.id, "accept")}
      >
        Approve
      </button>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 cursor-pointer"
        onClick={() => handleRevisionAction(submission.id, "reject")}
      >
        Reject
      </button>
    </div>
  </div>
) : submission.status === "rejected" ? (
  <div className="p-4 border border-red-400 bg-red-100 rounded-lg">
    <p className="text-red-600 font-semibold">❌ This revision request has been rejected.</p>
    <p className="font-medium mt-2">📌 Current Status: <span className="text-red-500">Rejected</span></p>
    <p className="mt-2">📝 Score: <span className="font-semibold">{submission.score || "Not Graded"}</span></p>
    <p className="mt-1">💬 Feedback: <span className="italic">{submission.feedback || "No Feedback"}</span></p>
  </div>
) : (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-5">
      <div className="w-full">
        <input
          type="number"
          placeholder="Enter Score (0-100)"
          max={100}
          min={0}
          className="border border-slate-300 py-2 px-4 bg-white focus:outline-none rounded-lg w-full"
          value={submission.score}
          onChange={(e) => handleScoreChange(submission.id, e.target.value)}
        />
        {errors[submission.id] && (
          <p className="text-red-500 text-sm mt-1">{errors[submission.id]}</p>
        )}
      </div>
      <input
        placeholder="Enter Feedback"
        className="border border-slate-300 py-2 px-4 bg-white focus:outline-none rounded-lg w-full"
        value={feedbacks[submission.id] || ""}
        onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
      />
    </div>
    <div className="flex gap-3">
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 cursor-pointer"
        onClick={() => handleGradeSubmission(submission.id, "success")}
      >
        Submit
      </button>
      <button
        className={`bg-yellow-500 text-white py-2 px-4 rounded-lg ${
          isRevisionDisabled[submission.id]
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-600 cursor-pointer"
        }`}
        onClick={() =>
          !isRevisionDisabled[submission.id] &&
          handleGradeSubmission(submission.id, "revision")
        }
        disabled={isRevisionDisabled[submission.id]}
      >
        Request Revision
      </button>
    </div>
  </div>
)}

        </div>
      ))}
    </div>
  );
};

TaskPending.propTypes = {
  taskId: PropTypes.number.isRequired,
};

export default TaskPending;
