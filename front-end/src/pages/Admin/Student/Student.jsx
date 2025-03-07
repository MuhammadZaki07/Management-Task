import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import Create from "../Student/Create";
import Edit from "../Student/Edit";
import TableComponent from "../../../components/TableCompoenent";
import LoadingPage from "../../../components/LoadingPage";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (selectedIds) => {
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    });

    if (!confirm.isConfirmed) return;

    let failedDeletes = [];

    for (const id of selectedIds) {
      try {
        await axios.delete("http://localhost:8000/api/students/destroy", {
          data: { ids: [id] },
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents((prev) => prev.filter((student) => student.id !== id));
      } catch (error) {
        console.error(
          `Gagal menghapus student ID ${id}:`,
          error.response?.data?.message || error.message
        );
        failedDeletes.push(id);
        break;
      }
    }

    if (failedDeletes.length > 0) {
      const failedMessages = failedDeletes
        .map((f) => `ID ${f}: Gagal menghapus karena masih memiliki relasi.`)
        .join("\n");

      const forceDelete = await Swal.fire({
        title: "Gagal menghapus!",
        text: `${failedMessages}\nIngin menghapus paksa?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus paksa!",
      });

      if (forceDelete.isConfirmed) {
        for (const id of failedDeletes) {
          try {
            await axios.delete(
              `http://localhost:8000/api/students/force-destroy`,
              {
                data: { ids: failedDeletes },
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error("Failed to force delete student:", error);
          }
        }
        Swal.fire(
          "Terhapus!",
          "Data student telah dihapus secara paksa.",
          "success"
        );
      }
    } else {
      Swal.fire("Terhapus!", "Data student telah dihapus.", "success");
    }
  };

  const handleEdit = (student) => {
    setModalState({ isOpen: true, mode: "edit", student });
  };

  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create", student: null });
  };

  const handleSuccess = () => {
    setModalState({ isOpen: false });
  };

  const handleImport = () => {
    setModalState({ isOpen: true, mode: "create-import", student: null });
  };

  const columns = [
    {
      accessorKey: "user.name",
      id: "name",
      header: "Student Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.email",
      id: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.gender",
      header: "Gender",
      cell: (info) => (info.getValue() === "L" ? "Boy" : "Girl"),
    },
    { accessorKey: "user.age", header: "Age", cell: (info) => info.getValue() },
    {
      accessorKey: "user.no_tlp",
      header: "Telephone",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => info.getValue()?.department_name,
    },
    {
      accessorKey: "class.class_name",
      header: "Class Room",
      cell: (info) => {
        const className = info.getValue();
        return className === undefined ? "-" : className;
      },
    },
  ];
  if (loading)
    return (
      <>
        <LoadingPage />
      </>
    );

  return (
    <>
      <TableComponent
        data={students}
        description={`Manage data with filters and sorting Students.`}
        columns={columns}
        title="List Of Student"
        Edit={handleEdit}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onImport={handleImport}
      />
      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? (
            <Create onSuccess={handleSuccess} modalState={modalState} />
          ) : modalState.mode === "create-import" ? (
            <Create onSuccess={handleSuccess} modalState={modalState} />
          ) : (
            <Edit student={modalState.student} onSuccess={handleSuccess} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Student;
