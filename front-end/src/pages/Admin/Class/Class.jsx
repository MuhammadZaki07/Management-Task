import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../../components/Modal";
import Create from "../Class/Create";
import Edit from "../Class/Edit";
import TableComponent from "../../../components/TableCompoenent";
import Swal from "sweetalert2";
import LoadingPage from "../../../components/LoadingPage";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(true);
      setClasses(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEdit = (classData) => {
    setModalState({ isOpen: true, mode: "edit", classData });
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
        setLoading(true);
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
            setLoading(false);
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

  const handlePromoteClass = async (classIds) => {
    if (!classIds || classIds.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "No class selected for promotion.",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "The selected classes and their students will be promoted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, promote them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing...",
          text: "Please wait while the classes are being promoted.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const classesToPromote = classIds.map((classId) => ({
            old_class_id: classId,
            new_class_name: `11-RPL-${classId}`,
          }));

          const response = await axios.post(
            "http://localhost:8000/api/students/promote",
            { classes: classesToPromote },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
          });

          fetchClasses();
        } catch (error) {
          console.log("Error response:", error.response?.data);
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Something went wrong.",
            icon: "error",
          });
        } finally {
          Swal.close();
        }
      }
    });
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
    {
      header: "Academic Year",
      accessorKey: "academic_year.year",
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
        data={classes}
        columns={columns}
        title="Classes"
        description="Manage all your classes here"
        onEdit={handleEdit}
        onDelete={handleDeleteClasses}
        onCreate={handleCreate}
        onPromote={handlePromoteClass}
      />

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? (
            <Create onSuccess={handleSuccess} />
          ) : (
            <Edit onSuccess={handleSuccess} classId={modalState.classData.id} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Class;
