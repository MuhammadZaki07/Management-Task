import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../../components/Modal";
import Create from "../Departement/Create";
import Edit from "../Departement/Edit";
import TableComponent from "../../../components/TableCompoenent";
import Swal from "sweetalert2";

const Departement = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "",
    data: null,
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
        console.error("Gagal mengambil data departemen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [departments, token]);

  const columns = [
    {
      accessorKey: "department_name",
      id: "name",
      header: "Departement Name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.department_name}
        </span>
      ),
    },
  ];

  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create" });
  };

  const handleSuccess = () => {
    setModalState({ isOpen: false });
  };

  const handleDelete = async (ids) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8000/api/departments/destroy", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { id: Array.isArray(ids) ? ids : [ids] },
          });

          setDepartments((prev) =>
            prev.filter((dept) => !ids.includes(dept.id))
          );

          Swal.fire({
            title: "Deleted!",
            text: "Departemen berhasil dihapus.",
            icon: "success",
          });
        } catch (error) {
          console.error("Gagal menghapus departemen:", error);

          let errorMessage = "Gagal menghapus departemen.";

          if (error.response && error.response.data.message) {
            errorMessage = error.response.data.message;
          }

          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <TableComponent
          data={departments}
          columns={columns}
          title="Department"
          description="Manage and view the list of departments, including adding, editing, and deleting department records."
          onCreate={handleCreate}
          onEdit={(data) => setModalState({ isOpen: true, mode: "edit", data })}
          onDelete={handleDelete}
        />
      )}

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? (
            <Create onClose={handleSuccess} />
          ) : (
            <Edit data={modalState.data} onClose={handleSuccess} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Departement;
