import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";

const Edit = ({ adminData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: adminData?.name || "",
    email: adminData?.email || "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/adminsUpdate/${adminData.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Berhasil!", "Data admin berhasil diperbarui.", "success");
      onSuccess();
    } catch (error) {
      console.error("Gagal memperbarui admin:", error.response?.data?.message || error.message);
      Swal.fire("Error!", "Gagal memperbarui admin.", "error");
    }
  };

  return (
    <div className="py-5 w-full">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <label className="block text-gray-700 font-medium">Nama</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
          />
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

Edit.propTypes = {
  adminData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
};

Edit.defaultProps = {
  adminData: {
    id: 0,
    name: "",
    email: "",
  },
};

export default Edit;
