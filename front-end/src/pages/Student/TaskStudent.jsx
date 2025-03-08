import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/task-grading", {
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
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Task</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
            commodi.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="border bg-white border-green-500 cursor-pointer text-white font-semibold w-12 h-12 rounded-full">
            <i className="bi bi-arrow-clockwise text-green-500"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 w-full">
        {tasks.map((taskData) => {
          const task = taskData.task;
          const taskClass = taskData.class;
          const isDeadlinePassed = new Date(task.due_date) < new Date();
          const timeRemaining = new Date(task.due_date) - new Date();
          const hoursRemaining = timeRemaining / 1000 / 60 / 60;
          const deadlineColor =
            hoursRemaining <= 5
              ? "bg-red-600 animate-ping"
              : "bg-green-600 animate-bounce";

          <div
            className={`w-3 h-3 rounded-full ${
              isDeadlinePassed ? "bg-none" : `${deadlineColor} animate-ping`
            }`}
          ></div>;

          return (
            <Link
              to={`/student-layout/detail-task/${task.id}`}
              key={task.id}
              className={`bg-white rounded-xl p-4 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer ${
                isDeadlinePassed ? "opacity-50" : ""
              }`}
            >
              <h1 className="font-semibold text-2xl text-slate-800">
                {task.title}
              </h1>
              <p className="text-slate-500 text-xs font-normal mt-2">
                {taskClass.class_name} | {formatDate(task.created_at)}
              </p>
              <p className="text-slate-500 text-sm font-normal mt-2">
                {task.lesson.name} | {task.teacher.user.name}
              </p>
              <div
                className={`py-3 mb-3 ${
                  isDeadlinePassed ? "bg-none" : "flex gap-5 items-center"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    isDeadlinePassed ? "bg-none" : `${deadlineColor}`
                  }`}
                ></div>
                <p className="text-slate-500 text-xs font-normal">
                  Deadline : {formatDate(task.due_date)}
                </p>
              </div>
              <div className="flex gap-5">
                <div className="flex gap-3 text-slate-500 text-sm">
                  <i className="bi bi-file-earmark-text-fill"></i>
                  <p>
                    {task.files && JSON.parse(task.files).length > 0
                      ? `${JSON.parse(task.files).length} Dokumen`
                      : "Tidak ada dokumen"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Task;
