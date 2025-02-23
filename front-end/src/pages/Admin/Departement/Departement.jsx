import { useState } from "react";
import Modal from "../../../components/Modal";
import Create from "../Class/Create";
import Edit from "../Class/Edit";

const Departement = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const departments = [
    { id: 1, name: "Rekayasa Perangkat Lunak" },
    { id: 2, name: "Teknik Komputer dan Jaringan" },
    { id: 3, name: "Multimedia" },
    { id: 4, name: "Akuntansi dan Keuangan" },
  ];

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter ? dept.name.includes(filter) : true)
  );

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Departement</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
            commodi.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="bg-worn hover:bg-slate-400 cursor-pointer text-white font-semibold rounded-lg py-3 px-5"
          >
            Create
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-5">
        <input
          type="text"
          placeholder="Search class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-1/5 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
        />
        <select
         className="border p-2 rounded-lg w-1/9 bg-white border-slate-300/[0.5] focus:outline-none px-4 font-normal"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Rekayasa">Rekayasa</option>
          <option value="Teknik">Teknik</option>
          <option value="Akuntansi">Akuntansi</option>
        </select>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              No
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-slate-500">
              Departement Name
            </td>
            <td className="font-semibold text-lg text-[#fc691f] py-2.5 border-b border-orange-500">
              Action
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((dept, index) => (
            <tr key={dept.id} className="odd:bg-slate-100">
              <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
                {index + 1}
              </td>
              <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500">
                {dept.name}
              </td>
              <td className="font-medium text-sm text-[#464444] py-3 border-b border-slate-500 flex gap-5">
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

export default Departement;
