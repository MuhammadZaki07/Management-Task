import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import TableComponent from "../../../components/TableCompoenent";
import Create from "./Create";
import Edit from "./Edit";
import LoadingPage from "../../../components/LoadingPage";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const token = localStorage.getItem("token");
  const [loading,setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "",
    adminData: null,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const adminUsers = response.data.filter((user) => user.role === "admin");
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }finally{
      setLoading(false)
    }
  };

  const handleCreate = () => {
    setModalState({ isOpen: true, mode: "create" });
  };

  const handleEdit = (admin) => {
    setModalState({ isOpen: true, mode: "edit", adminData: admin });
  };

  const handleSuccess = () => {
    setModalState({ isOpen: false });
  }

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
  
    try {
      await axios.delete("http://localhost:8000/api/admins/destroy", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedIds }, // Kirim sebagai JSON
      });
  
      Swal.fire("Terhapus!", "Data admin telah dihapus.", "success");
  
      setAdmins((prev) => prev.filter((admin) => !selectedIds.includes(admin.id)));
    } catch (error) {
      console.error("Gagal menghapus admin:", error.response?.data?.message || error.message);
      Swal.fire("Error!", "Gagal menghapus beberapa admin.", "error");
    }
  };
  
  if(loading){
    return (
      <LoadingPage/>
    )
  }
  
  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email address" },
    { accessorKey: "role", header: "Role" },
  ];

  return (
    <>
      <TableComponent
        data={admins}
        columns={columns}
        title="ALL ADMINS"
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        description="LIST OF ALL ADMIN USERS"
      />
      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={() => setModalState({ isOpen: false, mode: "" })}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? (
            <Create onSuccess={handleSuccess} />
          ) : (
            <Edit onSuccess={handleSuccess} adminData={modalState.adminData} />
          )}
        </Modal>
      )}
    </>
  );
};

export default Admin;
