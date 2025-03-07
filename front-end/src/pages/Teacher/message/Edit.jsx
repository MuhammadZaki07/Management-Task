import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Edit = ({ data, onClose, refreshData }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: data?.title || "",
    message: data?.message || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/announcements/${data.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refreshData();
      onClose();
    } catch (error) {
      console.error("Gagal mengupdate pesan:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label htmlFor="title" className="font-semibold block">
        Title Message
      </label>
      <input
        type="text"
        name="title"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="Title Message"
        value={formData.title}
        onChange={handleChange}
      />

      <label htmlFor="content" className="font-semibold block">
        Description
      </label>
      <textarea
        name="message"
        rows={5}
        placeholder="Description"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        value={formData.message}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 cursor-pointer focus:outline-none"
      >
        Save Changes
      </button>
    </form>
  );
};

Edit.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default Edit;
