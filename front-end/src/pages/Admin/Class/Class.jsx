import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Class/Create";
import Edit from "../Class/Edit";

const dummyClasses = [
  { id: 1, name: "10-RPL-A", major: "RPL" },
  { id: 2, name: "10-RPL-B", major: "RPL" },
  { id: 3, name: "11-RPL-A", major: "RPL" },
  { id: 4, name: "10-TKJ-A", major: "TKJ" },
  { id: 5, name: "11-TKJ-B", major: "TKJ" },
  { id: 6, name: "12-Animasi-A", major: "Animasi" },
  { id: 7, name: "10-Otomotif-A", major: "Otomotif" },
];

const Class = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredClasses = dummyClasses.filter((cls) => {
    return (
      (filter === "All" || cls.major === filter) &&
      cls.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-10">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Classes</h1>
          <p className="font-normal text-slate-500">Manage Class SMKK</p>
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

      <div className="flex gap-4 mb-10 justify-end">
        <input
          type="text"
          placeholder="Search class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-1/5 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg w-1/9 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normald"
        >
          <option value="All">All Majors</option>
          <option value="RPL">RPL</option>
          <option value="TKJ">TKJ</option>
          <option value="Animasi">Animasi</option>
          <option value="Otomotif">Otomotif</option>
        </select>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
            <td className="py-2.5">No</td>
            <td className="py-2.5">Class Name</td>
            <td className="py-2.5">Major</td>
            <td className="py-2.5">Action</td>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls, index) => (
              <tr key={cls.id} className="odd:bg-slate-100 font-medium text-sm text-[#464444] border-b border-slate-500">
                <td className="py-3">{index + 1}</td>
                <td className="py-3">{cls.name}</td>
                <td className="py-3">{cls.major}</td>
                <td className="py-3 flex gap-5">
                  <button onClick={() => setModalState({ isOpen: true, mode: "edit" })}>
                    <i className="bi bi-pencil-fill text-xl cursor-pointer"></i>
                  </button>
                  <i className="bi bi-trash3-fill text-xl"></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No data</td>
            </tr>
          )}
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

export default Class;
