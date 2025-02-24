import { useState } from "react";
import Modal from "../../../components/Modal";
import { Link } from "react-router-dom";
import Create from "../../Admin/Teacher/Create";
import Edit from "../../Admin/Teacher/Edit";

const Task = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });

  const tasks = [
    {
      id: 1,
      name: "Project Website",
      class: "11-RPL-A",
      date: "10-02-2025",
      lesson: "Web Development",
      teacher: "Mr. Smith",
      documents: 3,
      deadline: "12-02-2025 - 15-02-2025",
    },
    {
      id: 2,
      name: "Network Setup",
      class: "10-TKJ-B",
      date: "12-02-2025",
      lesson: "Networking",
      teacher: "Ms. Johnson",
      documents: 2,
      deadline: "14-02-2025 - 17-02-2025",
    },
    {
      id: 3,
      name: "3D Animation",
      class: "12-Animasi-C",
      date: "15-02-2025",
      lesson: "Animation",
      teacher: "Mr. Anderson",
      documents: 4,
      deadline: "17-02-2025 - 20-02-2025",
    },
    {
      id: 4,
      name: "Car Engine Analysis",
      class: "11-Otomotif-A",
      date: "18-02-2025",
      lesson: "Mechanical Engineering",
      teacher: "Mr. Brown",
      documents: 1,
      deadline: "20-02-2025 - 23-02-2025",
    },
  ];
  

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

      <div className="grid grid-cols-4 gap-5 w-full py-10">
        {tasks.map((task) => (
          <Link to={`/teacher-layout/detail-task`} key={task.id} className="bg-white rounded-xl p-4 hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
            <h1 className="font-semibold text-2xl text-slate-800">
              {task.name}
            </h1>
            <p className="text-slate-500 text-xs font-normal mt-2">
              {task.class} | {task.date}
            </p>
            <p className="text-slate-500 text-sm font-normal mt-2">
              Lesson: {task.lesson} | {task.teacher}
            </p>
            <div className="flex gap-5 items-center py-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
              <p className="text-slate-500 text-xs font-normal">Deadline : {task.deadline}</p>
            </div>
            <div className="flex gap-5">
              <div className="flex gap-3 text-slate-500 text-sm">
                <i className="bi bi-file-earmark-text-fill"></i>
                <p>{task.documents < 1 ? "tidak ada document" : task.documents + " Document"}{task.documents > 1 ? "s" : ""}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

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
