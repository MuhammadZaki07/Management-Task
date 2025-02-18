import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Student/Create";
import Edit from "../Student/Edit"; 

const Student = () => {
  const [modalState, setModalState] = useState({isOpen : false , mode: ""});

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Student</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, commodi.
          </p>
        </div>
        <div>
          <button
           onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="bg-worn hover:bg-slate-400 cursor-pointer text-white font-semibold rounded-lg py-3 px-5"
          >
            Create
          </button>
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">ID</td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">Student Name</td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">Gender</td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">Telephone</td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500">Department</td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-slate-100">
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">00354</td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">Erika Putri</td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">Female</td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">083846871126</td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">Rekayasa Perangkat Lunak</td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500 flex gap-5">
              <button onClick={() => setModalState({ isOpen: true, mode: "edit" })}>
                <i className="bi bi-pencil-fill text-xl cursor-pointer"></i>
              </button>
              <i className="bi bi-trash3-fill text-xl"></i>
            </td>
          </tr>
        </tbody>
      </table>

      {modalState.isOpen && (
        <Modal isOpen={modalState.isOpen} setOpen={setModalState} mode={modalState.mode}>
          {modalState.mode === "create" ? <Create /> : <Edit />}
        </Modal>
      )}
    </div>
  );
};

export default Student;
