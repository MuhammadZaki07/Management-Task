import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Edit = ({ task, onSuccess }) => {
  const [taskName, setTaskName] = useState(task?.title || "");
  const [taskDescription, setTaskDescription] = useState(
    task?.description || ""
  );
  const [status, setStatus] = useState(task?.status || "active");
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validationErrors = {};
    if (!taskName.trim()) validationErrors.taskName = "Task name is required";
    if (!taskDescription.trim())
      validationErrors.taskDescription = "Task description is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/assignments/${task.id}`,
        {
          title: taskName,
          description: taskDescription,
          status: status,
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
        {errors.taskName && (
          <p className="text-red-500 text-sm">{errors.taskName}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-slate-700">Task Description</label>
        <textarea
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
        {errors.taskDescription && (
          <p className="text-red-500 text-sm">{errors.taskDescription}</p>
        )}
      </div>

      <div>
        <label className="font-medium text-slate-700">Task Status</label>
        <select
          className="w-full bg-white py-2 px-4 rounded-lg border border-orange-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="non-active">Non-Active</option>
        </select>
      </div>

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
