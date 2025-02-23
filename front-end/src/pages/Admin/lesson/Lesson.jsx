import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Lesson/Create";
import Edit from "../Lesson/Edit";

const Lesson = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWorkOf, setFilterWorkOf] = useState("");
  const [filterCuriculum, setFilterCuriculum] = useState("");

  const lessons = [
    { id: 1, name: "IPA", workOf: "PT KARYA BUKU", curiculum: "2007" },
    { id: 2, name: "Matematika", workOf: "PT Ilmu Cerdas", curiculum: "2010" },
    {
      id: 3,
      name: "Bahasa Indonesia",
      workOf: "PT KARYA BUKU",
      curiculum: "2007",
    },
  ];

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterWorkOf ? lesson.workOf === filterWorkOf : true) &&
      (filterCuriculum ? lesson.curiculum === filterCuriculum : true)
  );

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Lesson</h1>
          <p className="font-normal text-slate-500">
            Manage your lessons effectively.
          </p>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, mode: "create" })}
          className="bg-worn hover:bg-slate-400 cursor-pointer text-white font-semibold rounded-lg py-3 px-5"
        >
          Create
        </button>
      </div>

      <div className="flex gap-5 justify-end mb-4">
        <input
          type="text"
          placeholder="Search lesson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-1/5 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
        />
        <select
          className="border p-2 rounded-lg w-1/9 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
          value={filterWorkOf}
          onChange={(e) => setFilterWorkOf(e.target.value)}
        >
          <option value="">All Work Of</option>
          {[...new Set(lessons.map((l) => l.workOf))].map((work) => (
            <option key={work} value={work}>
              {work}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded-lg w-1/9 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
          value={filterCuriculum}
          onChange={(e) => setFilterCuriculum(e.target.value)}
        >
          <option value="">All Curiculum</option>
          {[...new Set(lessons.map((l) => l.curiculum))].map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="py-2 border-b">No</th>
            <th className="py-2 border-b">Lesson Name</th>
            <th className="py-2 border-b">Work Of</th>
            <th className="py-2 border-b">Curiculum</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLessons.map((lesson, index) => (
            <tr key={lesson.id} className="odd:bg-slate-100 text-center">
              <td className="py-3 border-b">{index + 1}</td>
              <td className="py-3 border-b">{lesson.name}</td>
              <td className="py-3 border-b">{lesson.workOf}</td>
              <td className="py-3 border-b">{lesson.curiculum}</td>
              <td className="py-3 border-b flex gap-3 justify-center">
                <button
                  onClick={() => setModalState({ isOpen: true, mode: "edit" })}
                >
                  <i className="bi bi-pencil-fill text-xl cursor-pointer"></i>
                </button>
                <i className="bi bi-trash3-fill text-xl cursor-pointer"></i>
              </td>
            </tr>
          ))}
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

export default Lesson;
