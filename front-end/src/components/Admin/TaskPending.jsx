import { useEffect, useState } from "react";
import axios from "axios";

const TaskPending = ({taskId}) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/task-submissions/filter?task_id=${taskId}&status=pending`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching pending submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSubmissions();
  }, []);
console.log(submissions);

  if (loading) return <p>Loading pending submissions...</p>;
  if (submissions.length === 0) return <p>No pending submissions.</p>;

  return (
    <div className="bg-white rounded-xl w-full p-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className={`flex items-center gap-5 pb-3 ${submission.length > 1 ? "mb-3" : "mb-0"}`}
        >
          <img
            src={`${submission.student.gender === "P" ? "/student/girl.png" : "/student/boy.png"}`}
            className="w-28 rounded-xl overflow-hidden"
            alt="student-avatar"
          />
          <div className="flex gap-2 flex-col border-r-5 border-dotted border-r-orange-500 w-5/7 px-3">
            <h1 className="font-bold text-sm text-[#5b6087]">
              {submission.student?.user?.name || "Unknown Student"}
            </h1>
            <h3 className="font-light text-xs text-[#5b6087]">
              {submission.student?.class?.class_name || "-"} |{" "}
              {submission.student?.department?.department_name || "-"}
            </h3>
            <p className="font-light text-slate-500 text-sm">
              {submission.submission_text || "No description provided."}
            </p>
            {submission.submission_file && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg flex items-center gap-3 border border-gray-200">
                  <i className="bi bi-file-earmark-text text-xl text-blue-600"></i>
                  <a
                    href={`http://localhost:8000/storage/${submission.submission_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View File
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 py-2">
            <span className="text-slate-500 text-xs">Time : 08:00</span>
            <span className="text-slate-500 text-xs">Subjects : Mathematic</span>
            <div className="flex gap-4">
              <input
                type="text"
                className="bg-white rounded-xl w-full focus:outline-none text-slate-500 font-normal text-sm px-4 border border-orange-500 py-2 flex-[3]"
                placeholder="ex: 10-100"
              />
              <button className="bg-orange-400 text-white rounded-xl flex-[5]">
                Done
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPending;
