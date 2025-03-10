import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

const Create = ({ onClose }) => {
  const token = localStorage.getItem("token");
  const [departmentName, setDepartmentName] = useState("");

  const handleChange = (e) => {
    setDepartmentName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      Swal.fire({
        title: "Error",
        text: "Department Name cannot be blank!",
        icon: "error",
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/departments",
        { department_name: departmentName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Success!!",
        text: "Department added successfully.",
        icon: "success",
      });

      onClose();
    } catch (error) {
      console.error("Failed to add department:", error);

      let errorMessage = "Tan error occurred while adding a department.";

      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
      <label htmlFor="department_name" className="font-medium">
        Name
      </label>
      <input
        type="text"
        name="department_name"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal border border-orange-500/[0.5] focus:outline-none"
        placeholder="Name Departement"
        value={departmentName}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
      >
        Save
      </button>
    </form>
  );
};

Create.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Create;
