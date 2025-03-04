import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import Create from "../Lesson/Create";
import Edit from "../Lesson/Edit";
import axios from "axios";
import TableComponent from "../../../components/TableCompoenent";

const Lesson = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [lessons, setLessons] = useState([]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      axios
        .get("/api/lessons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLessons(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
          Swal.fire("Error", "Failed to fetch lessons data.", "error");
        });
    }
  }, [token]);

  const columns = [
    {
      header: "Lesson Name",
      accessorKey: "name",
    },
    {
      header: "Curiculum",
      accessorKey: "curiculumn",
    },
  ];

  const handleDeleteLesson = (ids) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, these lessons cannot be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/api/lessons/destroy", {
            data: { ids: ids },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setLessons((prevLessons) =>
              prevLessons.filter((lesson) => !ids.includes(lesson.id))
            );
            Swal.fire("Deleted!", "The lessons have been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting lessons:", error);
            Swal.fire("Error", "Failed to delete lessons.", "error");
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

  const handleEdit = (lesson) => {
    setModalState({ isOpen: true, mode: "edit", lesson });
  };

  return (
    <>
      <TableComponent
        data={lessons}
        columns={columns}
        title="Lesson Management"
        description="Manage your lessons effectively."
        onDelete={handleDeleteLesson}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? <Create onSucces={handleSuccess}/> : <Edit lesson={modalState.lesson} onSucces={handleSuccess}/>}
        </Modal>
      )}
    </>
  );
};

export default Lesson;
