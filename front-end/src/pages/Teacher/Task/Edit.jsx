import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Edit = ({ task, onSuccess }) => {
  const [isDeadlineEnabled, setIsDeadlineEnabled] = useState(false);
  const [taskName, setTaskName] = useState(task?.title || "");
  const [taskDescription, setTaskDescription] = useState(task?.description || "");
  const [startDeadline, setStartDeadline] = useState("");
  const [endDeadline, setEndDeadline] = useState("");
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (task?.due_date) {
      const dateParts = task.due_date.split(" ");
      setStartDeadline(dateParts[0] || "");
      setEndDeadline(dateParts.length > 1 ? dateParts[1] : dateParts[0] || "");
      setIsDeadlineEnabled(true);
    }
  }, [task]);

  const handleCheckboxChange = (e) => {
    setIsDeadlineEnabled(e.target.checked);

    if (!e.target.checked) {
      console.log("Deadline dimatikan, setel ke NULL");
      setStartDeadline("");
      setEndDeadline("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validationErrors = {};
    if (!taskName.trim()) validationErrors.taskName = "Task name is required";
    if (!taskDescription.trim()) validationErrors.taskDescription = "Task description is required";
    if (isDeadlineEnabled && (!startDeadline || !endDeadline)) {
      validationErrors.deadline = "Start and end deadline are required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedDueDate =
    isDeadlineEnabled && startDeadline && endDeadline
      ? `${endDeadline} 23:59:59`
      : task.due_date
      ? task.due_date 
      : null;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${task.id}`,
        {
          title: taskName,
          description: taskDescription,
          due_date: formattedDueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Task Updated!",
          text: "Task successfully updated.",
          confirmButtonColor: "#3085d6",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating task", error);
      Swal.fire({
        icon: "error",
        title: "Task Update Failed",
        text: error.response?.data?.message || "Something went wrong.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="font-medium text-slate-700">Task Name</label>
        <input
          type="text"
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}
      </div>

      <div>
        <label className="font-medium text-slate-700">Task Description</label>
        <textarea
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
        {errors.taskDescription && <p className="text-red-500 text-sm">{errors.taskDescription}</p>}
      </div>

      <div className="col-span-2">
        <label className="font-medium text-slate-700 flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={isDeadlineEnabled}
            onChange={handleCheckboxChange}
          />{" "}
          Enable Deadline
        </label>
      </div>

      {isDeadlineEnabled && (
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="font-medium text-slate-700">Start Deadline</label>
            <input
              type="date"
              className="w-full py-2 px-4 rounded-lg border border-orange-500"
              value={startDeadline}
              onChange={(e) => setStartDeadline(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label className="font-medium text-slate-700">End Deadline</label>
            <input
              type="date"
              className="w-full py-2 px-4 rounded-lg border border-orange-500"
              value={endDeadline}
              onChange={(e) => setEndDeadline(e.target.value)}
              min={startDeadline}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-6 rounded-lg mt-5 cursor-pointer"
      >
        Save Changes
      </button>
    </form>
  );
};

Edit.propTypes = {
  task: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Edit;
