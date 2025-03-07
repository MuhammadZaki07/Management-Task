import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const Create = ({ onSuccess, modalState }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    no_tlp: "",
    class_id: "",
    department_id: "",
    age: "",
    password: "",
    password_confirmation: "",
  });
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/departments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(response.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchDepartments();
    fetchClasses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalState.mode === "create") {
        await axios.post("http://localhost:8000/api/students", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onSuccess();
      } else if (modalState.mode === "create-import") {
        Swal.fire({
          title: "Mengimpor data...",
          text: "Proses ini memerlukan waktu beberapa detik tergantung ukuran file.",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("class_id", formData.class_id);
        formDataUpload.append("department_id", formData.department_id);
        try {
          await axios.post(
            "http://localhost:8000/api/students/import",
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire("Sukses!", "Data telah berhasil diimpor.", "success");
          onSuccess();
        } catch (error) {
          console.error("Gagal mengimpor data:", error);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat mengimpor data.",
            "error"
          );
        } finally {
          Swal.close();
        }
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-5 w-full">
      {modalState.mode === "create" ? (
        <>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="gender" className="font-medium">
                Gender
              </label>
              <select
                name="gender"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="L">Male</option>
                <option value="P">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="no_tlp" className="font-medium">
                Telephone
              </label>
              <input
                type="text"
                name="no_tlp"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Telephone Number"
                value={formData.no_tlp}
                onChange={handleChange}
              />
              {errors.no_tlp && (
                <p className="text-red-500 text-sm">{errors.no_tlp[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="class_id" className="font-medium">
                Class
              </label>
              <select
                name="class_id"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                value={formData.class_id}
                onChange={handleChange}
              >
                <option value="">Choose Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              {errors.class_id && (
                <p className="text-red-500 text-sm">{errors.class_id[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="department_id" className="font-medium">
                Department
              </label>
              <select
                name="department_id"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                value={formData.department_id}
                onChange={handleChange}
              >
                <option value="">Choose Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.department_name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-red-500 text-sm">
                  {errors.department_id[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="age" className="font-medium">
                Age
              </label>
              <input
                type="number"
                name="age"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="password_confirmation" className="font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                className="w-full bg-white py-2 px-4 rounded-lg text-sm font-light focus:outline-none border border-orange-500/[0.5]"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="font-medium">Pilih Kelas:</label>
            <select
              name="class_id"
              className="w-full py-2 px-4 rounded-lg text-sm font-light border border-orange-500"
              value={formData.class_id}
              onChange={handleChange}
            >
              <option value="">Pilih Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
            {errors.class_id && (
              <p className="text-red-500 text-sm">{errors.class_id[0]}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Pilih Jurusan:</label>
            <select
              name="department_id"
              className="w-full py-2 px-4 rounded-lg text-sm font-light border border-orange-500"
              value={formData.department_id}
              onChange={handleChange}
            >
              <option value="">Pilih Jurusan</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_name}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <p className="text-red-500 text-sm">{errors.department_id[0]}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Import File:</label>
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full py-2 px-4 rounded-lg text-sm font-light border border-orange-500"
            />
            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file[0]}</p>
            )}
          </div>
        </>
      )}
      <button
        type="submit"
        className="bg-orange-400 text-white py-2 px-4 rounded-lg cursor-pointer"
      >
        Create Student
      </button>
    </form>
  );
};

Create.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  modalState: PropTypes.shape({
    mode: PropTypes.oneOf(["create", "create-import"]).isRequired,
  }).isRequired,
};

export default Create;
