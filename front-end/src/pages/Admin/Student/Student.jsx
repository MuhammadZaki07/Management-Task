import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import Create from "../Student/Create";
import Edit from "../Student/Edit";
import TableComponent from "../../../components/TableCompoenent";

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
  
        setStudents((prev) =>
          prev.filter((student) => student.id !== id)
        );
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
        Swal.fire("Terhapus!", "Data student telah dihapus secara paksa.", "success");
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

  const handleAssignClasses = async () => {
    const token = localStorage.getItem("token");

    const confirmAssign = await Swal.fire({
      title: "Are you sure?",
      text: "The system will automatically assign students to the classes. Are you sure you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign!",
      cancelButtonText: "Cancel",
    });

    if (!confirmAssign.isConfirmed) {
      return;
    }

    Swal.fire({
      title: "Assigning Classes...",
      text: "This might take a few seconds.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/assign-classes",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.close();
      console.log("Assign Classes Success:", response.data);
      Swal.fire(
        "Success!",
        "Classes have been successfully assigned.",
        "success"
      );
    } catch (error) {
      Swal.close();
      console.error("Error assigning classes:", error);
      Swal.fire(
        "Error!",
        "An error occurred while assigning the classes.",
        "error"
      );
    }
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

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
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
          onAssign={handleAssignClasses}
        />
      )}

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
    </div>
  );
};

export default Student;
