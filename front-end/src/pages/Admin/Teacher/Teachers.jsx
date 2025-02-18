import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "../Teacher/Edit";
const Teachers = () => {
  const [optionModal, setModal] = useState({isOpen : false , mode: ''});

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Teacher</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
            commodi.
          </p>
        </div>
        <div>
          <button
            onClick={() => setModal({isOpen : true , mode: 'create'})}
            className="bg-worn hover:bg-slate-400 cursor-pointer text-white font-semibold rounded-lg py-3 px-5"
          >
            Create
          </button>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              No
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Teacher Name
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Gender
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Telephone
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Email
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500">
              Teacher Of
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500">
              Action
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-slate-100">
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              1
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              Erika Putri
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              Female
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              083846871126
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              MuhamadzakiUlumuddin@gmail.com
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              RPL
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500 flex gap-5">
            <button onClick={() => setModal({ isOpen: true, mode: "edit" })}>
                <i className="bi bi-pencil-fill text-xl cursor-pointer"></i>
              </button>
              <i className="bi bi-trash3-fill text-xl"></i>
            </td>
          </tr>
        </tbody>
      </table>
      {optionModal.isOpen && (
     <Modal isOpen={optionModal.isOpen} setOpen={setModal} mode={optionModal.mode}>
      {optionModal.mode === 'create' ? <Create/> : <Edit/>}
     </Modal>
      )}
    </div>
  );
};

export default Teachers;
