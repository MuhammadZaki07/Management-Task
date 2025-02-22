import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Student/Create";
import Edit from "../Student/Edit";
import TableComponent from "../../../components/TableCompoenent"; // Import TableComponent

const Student = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });

  const data = [
    {
      id: "00354",
      name: "Erika Putri",
      gender: "Female",
      telephone: "083846871126",
      department: "Rekayasa Perangkat Lunak",
    },
  ];

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Student Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "telephone",
      header: "Telephone",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => info.getValue(),
    },
  ];

  return (
    <>  
    <TableComponent
      data={data}
      columns={columns}
      title="Student"
      Create={Create}
      Edit={Edit}
    />

    {modalState.isOpen && (
      <Modal isOpen={modalState.isOpen} setOpen={setModalState} mode={modalState.mode}>
        {modalState.mode === "create" ? <Create /> : <Edit />}
      </Modal>
    )}
    </>
  );
};

export default Student;
