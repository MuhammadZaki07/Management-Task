import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../../../components/TableCompoenent";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "./Edit";

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    teacher: null,
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/teachers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeachers(response.data.data);
      } catch (err) {
        setError("Gagal mengambil data guru");
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [teachers]);

  const handleDelete = async (selectedIds) => {
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
        await axios.delete(`http://localhost:8000/api/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(
          `Gagal menghapus guru ID ${id}:`,
          error.response?.data?.message || error.message
        );
        failedDeletes = selectedIds.slice(selectedIds.indexOf(id));
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
              `http://localhost:8000/api/teachers/${id}/force`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            setError(
              error.response?.data?.message ||
                "Gagal menghapus guru secara paksa"
            );
          }
        }
        Swal.fire(
          "Terhapus!",
          "Data guru telah dihapus secara paksa.",
          "success"
        );
      }
    } else {
      Swal.fire("Terhapus!", "Data guru telah dihapus.", "success");
    }

    setTeachers((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
  };

  const handleEdit = (teacher) => {
    setModalState({ isOpen: true, mode: "edit", teacher });
  };

  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create", teacher: null });
  };

  const handleSuccess = () => {
    setModalState({ isOpen: false });
  };

  const handleImport = () => {
    setModalState({ isOpen: true, mode: "create-import", teacher: null });
  };

  const columns = [
    {
      accessorKey: "user.name",
      header: "Nama",
      id: "name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.gender",
      header: "Gender",
      cell: (info) => (info.getValue() === "L" ? "Boy" : "Girl"),
    },
    {
      accessorKey: "user.age",
      header: "Usia",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.no_tlp",
      header: "No Telepon",
      cell: (info) => info.getValue(),
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <TableComponent
        data={teachers}
        description={`Manage data with filters and sorting Teacher.`}
        columns={columns}
        title="Daftar Guru"
        Edit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onEdit={handleEdit}
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
            <Edit teacher={modalState.teacher} onSuccess={handleSuccess} />
          )}
        </Modal>
      )}
    </>
  );
};

export default TeacherPage;
