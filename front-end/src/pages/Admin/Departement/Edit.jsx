import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

const Edit = ({ data, onClose }) => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    id: "",
    department_name: "",
  });

  useEffect(() => {
    if (data && data.id) {
      setFormData({
        id: data.id,
        department_name: data.department_name || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.department_name.trim()) {
      Swal.fire({
        title: "Error",
        text: "Nama Departemen tidak boleh kosong!",
        icon: "error",
      });
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/departments/${formData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Departemen berhasil diperbarui.",
        icon: "success",
      });

      onClose();
    } catch (error) {
      console.error("Gagal mengupdate departemen:", error);

      let errorMessage = "Terjadi kesalahan saat memperbarui departemen.";

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
      <label htmlFor="department_name" className="font-semibold">
        Name
      </label>
      <input
        type="text"
        name="department_name"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal border border-orange-500"
        placeholder="Nama Departemen"
        value={formData.department_name}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
      >
        Simpan Perubahan
      </button>
    </form>
  );
};

Edit.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    department_name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Edit;
