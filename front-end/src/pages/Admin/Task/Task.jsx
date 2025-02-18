import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Task/Create";
import Edit from "../Task/Edit";

const Task = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Task</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
            commodi.
          </p>
        </div>
        <div>
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="border border-orange-500 cursor-pointer text-white font-semibold rounded-lg py-3 px-5"
          >
            <i className="bi bi-file-earmark-plus-fill text-orange-500"></i>
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
              Document Name
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Size
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Date
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500"></td>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-slate-100">
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              1
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              <p className="font-semibold text-slate-500">Tugas Laravel 11</p>
              <p className="font-light text-sm">Dikirim ke : RPL-A</p>
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              134.4 kb
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              05-08-2025
            </td>
            <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
              <div className="flex gap-5">
                <button
                  onClick={() => setModalState({ isOpen: true, mode: "edit" })}
                >
                  <i className="bi bi-pencil-fill text-3xl cursor-pointer"></i>
                </button>
                <button>
                  <i className="bi bi-trash3-fill text-3xl cursor-pointer"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? <Create /> : <Edit />}
        </Modal>
      )}
    </div>
  );
};

export default Task;
