import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import TaskPending from "../../../components/Admin/TaskPending";
import Swal from "sweetalert2";

const DetailTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/assignments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data) {
          setTask(response.data);
        } else {
          setError("Task data is empty!");
        }
      } catch (error) {
        setError("Error fetching task.");
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Parsing files hanya dilakukan jika task ada
  useEffect(() => {
    if (!task) return;

    try {
      setDocuments(task.files ? JSON.parse(task.files) : []);
    } catch (error) {
      console.error("Error parsing task files:", error);
      setDocuments([]); // Pastikan dokumen tetap array kosong jika gagal parsing
    }
  }, [task]);

  const handleDownload = async (filePath) => {
    const correctPath = filePath.replace("tasks/", "");
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to download this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, download it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/download?file=${encodeURIComponent(
              correctPath
            )}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to download");

          const blob = await response.blob();
          const fileExtension = filePath.split(".").pop().toLowerCase();
          const isMedia = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "mp4",
            "mov",
            "avi",
          ].includes(fileExtension);
          const fileName = isMedia
            ? `media_TMS.${fileExtension}`
            : `document_TMS.${fileExtension}`;

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          Swal.fire("Downloaded!", "Your file has been downloaded.", "success");
        } catch (error) {
          console.error("Download error:", error);
          Swal.fire("Error!", "Failed to download the file.", "error");
        }
      }
    });
  };

  if (loading) return <div>Loading task...</div>;
  if (error) return <div>{error}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="px-16 py-10 w-full">
      <div className="flex flex-col gap-2 border-b-2 border-slate-300/[0.5]">
        <div className="flex gap-5 items-center">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
            <i className="bi bi-list-check text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-semibold">
            {task.title} | {task.lesson?.name || "No Subject"}
          </h1>
        </div>
        <p className="text-slate-500 text-sm font-normal mt-2">
          Teacher: {task.teacher?.user?.name ?? "Unknown"} |{" "}
          {new Date(task.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="py-3 mb-3">
          {task.status === "non-active" ? (
            <p className="text-red-600 text-xs font-semibold">
              Status: Non-Active
            </p>
          ) : (
            <div className="text-slate-500 text-xs font-normal flex items-center gap-3">
              {task.deadline ? (
                <>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      new Date(task.deadline) - new Date() <=
                      10 * 60 * 60 * 1000
                        ? "bg-red-600 animate-ping"
                        : "bg-green-500 animate-bounce"
                    }`}
                  ></div>
                  <p className="text-slate-500 text-xs font-normal">
                    {new Date(task.deadline).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </>
              ) : (
                <p className="text-slate-500 text-xs font-normal">
                  No Deadline
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="py-5 w-1/2">
        <p className="text-slate-500 text-sm font-normal text-left mt-3">
          {task.description}
        </p>

        <div className="mt-5">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Documents
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {documents.map((doc, index) => {
              const filePath = doc.startsWith("tasks/") ? doc : `tasks/${doc}`;
              const fileExtension = filePath.split(".").pop().toLowerCase();

              const mediaExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "mp4",
                "mov",
                "avi",
              ];
              const isMedia = mediaExtensions.includes(fileExtension);
              const displayName = isMedia
                ? `Media File ${index + 1}`
                : `Document File ${index + 1}`;

              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg flex items-center gap-3 border border-gray-200"
                >
                  <i className="bi bi-file-earmark-text text-xl text-blue-600"></i>
                  <button
                    onClick={() => handleDownload(filePath)}
                    className="text-sm text-blue-500 hover:underline cursor-pointer"
                  >
                    {displayName}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full border border-slate-300 mt-6"></div>
      </div>

      <div className="w-full">
        <div className="flex gap-5 items-center my-5">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <i className="bi bi-info text-3xl text-white"></i>
          </div>
          <h1 className="text-xl font-semibold">Task Pending</h1>
        </div>
        <div className="flex gap-5">
          <TaskPending taskId={id} />
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
