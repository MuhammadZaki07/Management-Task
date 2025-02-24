import { useState } from "react";
import ShowNotification from "./ShowNotification";
import Modal from "../../components/Modal";

const Notification = () => {
  const [isOpenModal, setOpenModal] = useState({ isOpen: false, mode: "" });
  return (
    <div className="px-16 py-10">
      <div className="flex justify-between">
        <h1 className="text-4xl text-salt font-bold">Notification</h1>
      </div>
      <div className="border border-slate-500/[0.5] mt-8 mb-6"></div>
      <div className="flex gap-3 flex-col">
        <div
          className="w-full rounded-lg bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between relative"
          onClick={() => setOpenModal({ isOpen: true, mode: "message" })}
        >
            <div className="w-4 h-4 rounded-full bg-red-500 absolute -right-2 -top-2 animate-pulse"></div>
          <div>
            <h1 className="text-slate-900 text-sm font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
              earum?
            </h1>
            <p className="text-slate-500 text-xs font-normal">05-09-2007</p>
          </div>
        </div>
        <div
          className="w-full rounded-lg opacity-50 bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between"
          onClick={() => setOpenModal({ isOpen: true, mode: "message" })}
        >
          <div>
            <h1 className="text-slate-900 text-sm font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
              earum?
            </h1>
            <p className="text-slate-500 text-xs font-normal">05-09-2007</p>
          </div>
        </div>
      </div>
      {isOpenModal.isOpen && (
        <Modal
          isOpen={isOpenModal.isOpen}
          setOpen={setOpenModal}
          mode={isOpenModal.mode}
        >
          <ShowNotification/>
        </Modal>
      )}
    </div>
  );
};

export default Notification;
