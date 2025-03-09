import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "./Edit";
import Swal from "sweetalert2";

const Task = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/assignments",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create" });
  };
  const handleSuccess = () => {
    setModalState({ isOpen: false, mode: "" });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setModalState({ isOpen: true, mode: "edit", task });
  };

  const handleDelete = async (taskId) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Tugas ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:8000/api/assignments/${taskId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: response.data.message,
            confirmButtonColor: "#3085d6",
          });

          fetchTasks();
        } catch (error) {
          console.error("Error deleting task", error);
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text:
              error.response?.data?.message ||
              "Terjadi kesalahan saat menghapus tugas.",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Task</h1>
          <p className="font-normal text-slate-500">
            List of tasks that have been made by the teacher.
          </p>
        </div>
        <div>
          <button
            onClick={handleCreate}
            className="border border-orange-500 cursor-pointer text-orange-400 font-semibold rounded-lg py-3 px-5"
          >
            <i className="bi bi-file-earmark-plus-fill text-orange-500"></i>{" "}
            Create Task
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-4 gap-5 w-full py-10">
          {tasks.length === 0 ? (
            <p>No Task</p>
          ) : (
            tasks.map((task) => (
              <Link
                to={`/teacher-layout/detail-task/${task.id}`}
                key={task.id}
                className={`${task.status === "non-active" ? "opacity-50" : "opacity-100"} bg-white rounded-xl p-4 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer`}
              >
                <div className="flex gap-3 items-center">
                  <h1 className="font-semibold text-2xl text-slate-800">
                    {task.title}
                  </h1>
                </div>
                <div className="text-slate-500 text-xs font-normal mt-2 flex gap-1">
                  <div>
                    {task.assigned_classes.length > 0
                      ? task.assigned_classes
                          .map((cls) => cls.class_name)
                          .join(", ")
                      : task.assignments.length > 0
                      ? "Individu"
                      : "Semua murid"}
                  </div>
                  <div>
                    |{" "}
                    {new Date(task.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <p className="text-slate-500 text-sm font-normal mt-2">
                  {task.lesson.name} | {task.teacher.user.name}
                </p>
                <div className="flex gap-5 items-center py-3 mb-3">
                  {task.deadline ? (
                    <>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === "non-active"
                            ? "bg-red-500"
                            : new Date(task.deadline) < new Date()
                            ? "bg-red-600 animate-ping"
                            : new Date(task.deadline) - new Date() <=
                              24 * 60 * 60 * 1000
                            ? "bg-red-600 animate-ping"
                            : new Date(task.deadline) - new Date() <=
                              3 * 24 * 60 * 60 * 1000
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-green-500 animate-bounce"
                        }`}
                      ></div>

                      <p className="text-slate-500 text-xs font-normal">
                        {task.status === "non-active" ? (
                          <span className="text-red-500 font-semibold">
                            Status: Non-Active
                          </span>
                        ) : (
                          <>
                            Deadline:{" "}
                            {new Date(task.deadline).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </>
                        )}
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
                      {task.files && JSON.parse(task.files).length > 0
                        ? `${JSON.parse(task.files).length} Dokumen`
                        : "Tidak ada dokumen"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(task.id);
                      }}
                      className="cursor-pointer"
                    >
                      <i className="bi bi-trash text-lg text-red-500"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEdit(task);
                      }}
                      className="cursor-pointer"
                    >
                      <i className="bi bi-pencil-square text-lg text-yellow-500"></i>
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? (
            <Create onSuccess={handleSuccess} />
          ) : (
            <Edit task={modalState.task} onSuccess={handleSuccess} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Task;
