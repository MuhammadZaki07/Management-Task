import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/student-assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading)
    return (
      <div className="w-full py-20 px-16">
        <div className="bg-slate-200 w-1/5 rounded-lg animate-pulse h-4"></div>
        <div className="bg-slate-200 w-1/3 mt-2 rounded-lg animate-pulse h-4"></div>
        <div className="grid grid-cols-4 gap-5 py-20">
          {Array.from({length: 8}).map((_,i) => (
            <div key={i + 1} className="bg-slate-200 animate-pulse rounded-lg w-full h-52"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Task</h1>
          <p className="font-normal text-slate-500">
            List of tasks you need to complete.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="border bg-white border-green-500 cursor-pointer text-white font-semibold w-12 h-12 rounded-full"
        >
          <i className="bi bi-arrow-clockwise text-green-500"></i>
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-slate-500 text-lg font-semibold">
          No tasks available for you at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-5 w-full">
          {tasks.map((task) => {
            const isDeadlinePassed = new Date(task.deadline) < new Date();
            const timeRemaining = new Date(task.deadline) - new Date();
            const hoursRemaining = timeRemaining / 1000 / 60 / 60;
            const deadlineColor = isDeadlinePassed
              ? "bg-red-500"
              : hoursRemaining <= 24
              ? "bg-red-600 animate-ping"
              : hoursRemaining <= 72
              ? "bg-yellow-500 animate-pulse"
              : "bg-green-500 animate-bounce";

            let files = [];
            try {
              files = task.files ? JSON.parse(task.files) : [];
            } catch (error) {
              console.error("Error parsing files:", error);
            }

            return (
              <Link
                to={`/student-layout/detail-task/${task.id}`}
                key={task.id}
                className={`${
                  isDeadlinePassed ? "opacity-50" : "opacity-100"
                } bg-white rounded-xl p-4 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer`}
              >
                <div className="flex gap-3 items-center">
                  <h1 className="font-semibold text-2xl text-slate-800">
                    {task.title}
                  </h1>
                </div>
                <div className="text-slate-500 text-xs font-normal mt-2 flex gap-1">
                  <div>{formatDate(task.created_at)}</div>
                </div>
                <p className="text-slate-500 text-sm font-normal mt-2">
                  {task.lesson?.name} | {task.teacher?.user?.name}
                </p>
                <div className="flex gap-5 items-center py-3 mb-3">
                  {task.deadline ? (
                    <>
                      <div
                        className={`w-3 h-3 rounded-full ${deadlineColor}`}
                      ></div>
                      <p className="text-slate-500 text-xs font-normal">
                        Deadline: {formatDate(task.deadline)}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs font-normal">
                      No Deadline
                    </p>
                  )}
                </div>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-3 text-slate-500 text-sm">
                    <i className="bi bi-file-earmark-text-fill"></i>
                    <p>
                      {files.length > 0
                        ? `${files.length} Dokumen`
                        : "Tidak ada dokumen"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Task;
