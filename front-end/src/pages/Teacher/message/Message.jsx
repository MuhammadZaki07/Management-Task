import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

const Message = () => {
  const [isOpenModal, setOpenModal] = useState({ isOpen: false, mode: "" });
  return (
    <div className="px-16 py-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl text-salt font-bold">Announcement</h1>
          <div className="text-slate-500 text-sm mt-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae
            distinctio quia nemo, minus in,
          </div>
        </div>
        <div>
          <i onClick={() => setOpenModal({ isOpen: true, mode: "create" })} className="bi bi-send-plus-fill bg-orange-100 px-5 py-5 cursor-pointer flex items-center justify-center rounded-lg border border-orange-500/[0.5]"></i>
        </div>
      </div>
      <div className="border border-slate-500/[0.5] mt-8 mb-6"></div>
      <div className="flex gap-3 flex-col">
        <div
          className="w-full rounded-lg bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between"
          onClick={() => setOpenModal({ isOpen: true, mode: "message" })}
        >
          <div>
            <h1 className="text-slate-900 text-sm font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
              earum?
            </h1>
            <p className="text-slate-500 text-xs font-normal">05-09-2007</p>
          </div>
          <div className="flex gap-5">
            <i
              className="bi bi-pencil-square text-lg"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal({ isOpen: true, mode: "edit" });
              }}
            ></i>
            <i className="bi bi-trash-fill text-lg"></i>
          </div>
        </div>
        <div
          className="w-full rounded-lg bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between"
          onClick={() => setOpenModal({ isOpen: true, mode: "message" })}
        >
          <div>
            <h1 className="text-slate-900 text-sm font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
              earum?
            </h1>
            <p className="text-slate-500 text-xs font-normal">05-09-2007</p>
          </div>
          <div className="flex gap-5">
            <i
              className="bi bi-pencil-square text-lg"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal({ isOpen: true, mode: "edit" });
              }}
            ></i>
            <i className="bi bi-trash-fill text-lg"></i>
          </div>
        </div>
      </div>
      {isOpenModal.isOpen && (
        <Modal
          isOpen={isOpenModal.isOpen}
          setOpen={setOpenModal}
          mode={isOpenModal.mode}
        >
          {isOpenModal.mode === "create" ? (
            <Create />
          ) : isOpenModal.mode === "message" ? (
            <Show />
          ) : (
            <Edit />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Message;
