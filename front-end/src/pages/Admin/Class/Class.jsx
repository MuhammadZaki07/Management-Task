import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Class/Create";
import Edit from "../Class/Edit";
import TableComponent from "../../../components/TableCompoenent";

const Class = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });

  const data = [
    {
      id: "00354",
      name: "11-RPL-A",
    },
    {
      id: "00355",
      name: "11-RPL-B",
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
      header: "Name Class",
      cell: (info) => info.getValue(),
    },
  ];

  return (
   <>
   <TableComponent
      data={data}
      columns={columns}
      title="Claass"
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

export default Class;
