import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SubmitTask from "../../components/Student/SubmitTask";
import Swal from "sweetalert2";

const DetailTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId,setStudentId] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTask(response.data);
      } catch (error) {
        setError("Error fetching task.");
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentId()
    fetchTask();
  }, [id]);
  
  const fetchStudentId = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/student-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStudentId(response.data.student_id)
    } catch (error) {
      console.error("Error fetching student_id:", error);
      throw new Error("Unable to fetch student_id");
    }
  };

  if (loading) return <div>Loading task...</div>;
  if (error) return <div>{error}</div>;
  if (!task) return <div>Task not found</div>;

  let documents = [];
  try {
    documents = task.files ? JSON.parse(task.files) : [];
  } catch (error) {
    setError("Error parsing task files.");
    console.error("Error parsing task files:", error);
  }

  const handleDownload = async (filePath) => {
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
              filePath
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

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatus = (dueDate) => {
    if (!dueDate) return { text: "No Deadline", color: "text-gray-500" };
  
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffHours = (deadline - now) / (1000 * 60 * 60); 
  
    if (diffHours <= 0) {
      return { text: "Non-Active", color: "text-red-500" };
    } else if (diffHours <= 2) {
      return { text: "Active", color: "text-yellow-500" };
    } else {
      return { text: "Active", color: "text-green-500" };
    }
  };
  
  const { text, color } = getStatus(task.due_date);
  
  return (
    <div className="px-16 py-10 w-full">
      <div className="flex flex-col gap-2 border-b-2 border-slate-300/[0.5]">
        <div className="flex gap-5 items-center">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
            <i className="bi bi-list-check text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-semibold">{task.title}</h1>
        </div>
        <p className="text-slate-500 text-sm font-normal mt-2">
          Teacher: {task.teacher?.user?.name ?? "Unknown"} |{" "}
          {formatDateWithDay(task.created_at)}
        </p>
        <div className="flex gap-5 items-center py-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-600 animate-ping"></div>
          <p className="text-slate-500 text-xs font-normal">
            Deadline:{" "}
            {task.due_date ? formatDateWithDay(task.due_date) : "No Deadline"}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-10">
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
                const filePath = doc.startsWith("tasks/")
                  ? doc
                  : `tasks/${doc}`;
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
                const displayName = isMedia
                  ? "Media File"
                  : filePath.split("/").pop();

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
        </div>
        <div>
          <div className="bg-white border border-slate-300/[0.5] p-2 rounded-lg px-4">
            <div className="flex justify-between">
              <div className="text-slate-700 text-lg font-medium">
                Task Submission
              </div>
              <div className={`${color} font-medium text-sm`}>{text}</div>
            </div>
            <SubmitTask taskId={task.id} studentId={studentId} assignments={task.assignments}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
