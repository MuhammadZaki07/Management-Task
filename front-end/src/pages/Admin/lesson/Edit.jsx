import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const Edit = ({ lesson, onSuccess }) => {
  const [lessonData, setLessonData] = useState({
    name: "",
    curiculumn: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (lesson) {
      setLessonData({
        name: lesson.name,
        curiculumn: lesson.curiculumn,
      });
    }
  }, [lesson]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    axios
      .put(
        `/api/lessons/${lesson.id}`,
        {
          name: lessonData.name,
          curiculumn: lessonData.curiculumn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        Swal.fire("Success", "Lesson updated successfully.", "success");
        onSuccess;
      })
      .catch((error) => {
        setIsLoading(false);
        Swal.fire("Error", "Failed to update lesson.", "error");
        console.error("Error updating lesson:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label htmlFor="name" className="font-semibold block">
        Lesson Name
      </label>
      <input
        type="text"
        name="name"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        value={lessonData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="curiculumn" className="font-semibold">
        Curriculum
      </label>
      <input
        type="text"
        name="curiculumn"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        value={lessonData.curiculumn}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="bg-orange-400 text-white py-2 px-4 rounded-lg mt-4 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Lesson"}
      </button>
    </form>
  );
};

Edit.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    curiculumn: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Edit;
