import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Create = ({onSuccess}) => {
  const [curiculum, setCuriculum] = useState("");
  const [bookName, setBookName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/lessons",
        {
          name: bookName,
          curiculumn: curiculum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Success", response.data.message, "success");
      onSuccess
      setCuriculum("");
      setBookName("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      Swal.fire("Error", error, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <label htmlFor="curiculum" className="font-medium block">
        Curriculum
      </label>
      <input
        type="text"
        id="curiculum"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500/[0.5]"
        value={curiculum}
        onChange={(e) => setCuriculum(e.target.value)}
      />
      <label htmlFor="bookName" className="font-medium">
        Book Name
      </label>
      <input
        type="text"
        id="bookName"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500/[0.5]"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-orange-400 text-white py-2 px-4 rounded-lg mt-4 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default Create;
