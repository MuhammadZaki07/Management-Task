import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Create = ({ onClose, refreshData }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sentToType: "role",
    sentToValue: "all",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.sentToType === "role") {
      setFormData((prev) => ({ ...prev, sentToValue: "all" }));
    } else {
      setFormData((prev) => ({ ...prev, sentToValue: "" }));
    }
  }, [formData.sentToType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title cannot be empty.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    if (!formData.sentToValue.trim()) newErrors.sentToValue = "Recipient cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let sentTo;
    if (formData.sentToType === "role") {
      sentTo = { role: formData.sentToValue };
    } else if (formData.sentToType === "users") {
      sentTo = { users: formData.sentToValue.split(",").map(Number) };
    } else if (formData.sentToType === "class") {
      sentTo = { class: formData.sentToValue.split(",") };
    }

    const requestData = {
      title: formData.title,
      message: formData.message,
      sent_to: sentTo,
    };

    try {
      await axios.post("http://localhost:8000/api/announcements", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshData();
      onClose();
    } catch (error) {
      console.error("Gagal mengirim pengumuman:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label htmlFor="title" className="font-semibold block">Title Message</label>
      <input
        type="text"
        name="title"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal border border-orange-500 focus:outline-none"
        placeholder="Title Message"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <label htmlFor="message" className="font-semibold block">Description</label>
      <textarea
        name="message"
        rows={5}
        placeholder="Description"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal border border-orange-500 focus:outline-none"
        value={formData.message}
        onChange={handleChange}
      />
      {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

      <label className="font-semibold block">Send To</label>
      <select
        name="sentToType"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500"
        value={formData.sentToType}
        onChange={handleChange}
      >
        <option value="role">Role (Admin/Guru/Murid/Semua)</option>
        <option value="users">Individu (ID tertentu)</option>
        <option value="class">Kelas Tertentu</option>
      </select>

      {formData.sentToType === "role" && (
        <select
          name="sentToValue"
          className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500"
          value={formData.sentToValue}
          onChange={handleChange}
        >
          <option value="all">Semua</option>
          <option value="admin">Admin</option>
          <option value="teacher">Guru</option>
          <option value="student">Murid</option>
        </select>
      )}

      {(formData.sentToType === "users" || formData.sentToType === "class") && (
        <input
          type="text"
          name="sentToValue"
          className="w-full bg-white py-2 px-4 rounded-lg text-sm border border-orange-500"
          placeholder={
            formData.sentToType === "users"
              ? "Masukkan ID pengguna, pisahkan dengan koma (contoh: 2,5,10)"
              : "Masukkan kelas, pisahkan dengan koma (contoh: 10-RPL-A,11-TKJ-B)"
          }
          value={formData.sentToValue}
          onChange={handleChange}
        />
      )}
      {errors.sentToValue && <p className="text-red-500 text-sm">{errors.sentToValue}</p>}

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 cursor-pointer focus:outline-none"
      >
        Send Announcement
      </button>
    </form>
  );
};

Create.propTypes = {
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default Create;
