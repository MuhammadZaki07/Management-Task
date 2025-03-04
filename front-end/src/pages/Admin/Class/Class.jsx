import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../../components/Modal";
import Create from "../Class/Create";
import Edit from "../Class/Edit";
import TableComponent from "../../../components/TableCompoenent";
import Swal from "sweetalert2";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const token = localStorage.getItem("token");

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes",{
        headers : {
          Authorization:`Bearer ${token}`
        }
      });
      setClasses(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [classes]);

  const handleEdit = (classData) => {
    setModalState({ isOpen: true, mode: "edit",classData });
  };

  const handleDeleteClasses = (ids) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, these classes cannot be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/api/classes/destroy", {
            data: { ids: ids },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setClasses((prevClasses) =>
              prevClasses.filter((classroom) => !ids.includes(classroom.id))
            );
            Swal.fire("Deleted!", "The classes have been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting classes:", error);
            Swal.fire("Error", "Failed to delete classes.", "error");
          });
      }
    });
  };

  const handleSuccess = () => {
    setModalState({ isOpen: false });
  };

  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create" });
  };

  const columns = [
    {
      header: "Class Name",
      accessorKey: "class_name",
    },
    {
      header: "Department",
      accessorKey: "department.department_name",
    },
    {
      header: "Home Room Teacher",
      accessorKey: "homeroom_teacher.user.name",
    },
    {
      header: "Grade Level",
      accessorKey: "grade_level",
    },
  ];
  return (
    <>
      <TableComponent
        data={classes}
        columns={columns}
        title="Classes"
        description="Manage all your classes here"
        onEdit={handleEdit}
        onDelete={handleDeleteClasses}
        onCreate={handleCreate}
      />

      {modalState.isOpen && (
        <Modal isOpen={modalState.isOpen} setOpen={setModalState} mode={modalState.mode}>
          {modalState.mode === "create" ? <Create onSuccess={handleSuccess}/> : <Edit onSuccess={handleSuccess} classes={modalState.classData}/>}
        </Modal>
      )}
    </>
  );
};

export default Class;
