import { useState } from "react";
import Modal from "../../components/Modal";
import Create from "../Admin/Task/Create";

const SharedStorage = () => {
    const dummyData = [
        {
          id: 1,
          documentName: "Tugas Laravel 11",
          recipient: "Ikrar Auliady",
          size: "134.4 kb",
          date: "05-08-2025",
        },
        {
          id: 2,
          documentName: "Materi React Hooks",
          recipient: "Yanuar Setyoningsih",
          size: "256.7 kb",
          date: "12-08-2025",
        },
        {
          id: 3,
          documentName: "Proposal Proyek",
          recipient: "Eko Mulyono",
          size: "512.2 kb",
          date: "20-08-2025",
        },
        {
          id: 4,
          documentName: "Dokumentasi API",
          recipient: "Ilham Setyo Nugroho",
          size: "102.5 kb",
          date: "28-08-2025",
        },
        {
          id: 5,
          documentName: "Laporan Mingguan",
          recipient: "Yanuar Setyoningsih",
          size: "89.3 kb",
          date: "05-09-2025",
        },
      ];
      
    const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
    
    return (
      <div className="px-16">
         <div className="flex justify-between items-center py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Shared Storage</h1>
          <p className="font-normal text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
            commodi.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="border bg-white border-orange-500 cursor-pointer text-white font-semibold w-12 h-12 rounded-full"
          >
            <i className="bi bi-file-earmark-plus-fill text-orange-500"></i>
          </button>
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="border bg-white border-green-500 cursor-pointer text-white font-semibold w-12 h-12 rounded-full"
          >
            <i className="bi bi-arrow-clockwise text-green-500"></i>
          </button>
        </div>
      </div>
  
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-white font-semibold text-lg text-[#fc691f] text-left border-b border-slate-500">
                <th className="py-2.5 px-4">
                  No
                </th>
                <th className="py-2.5 px-4">
                  Document Name
                </th>
                <th className="py-2.5 px-4">
                  Size
                </th>
                <th className="py-2.5 px-4">
                  Date
                </th>
                <th className="py-2.5 px-4 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((doc, index) => (
                <tr key={doc.id} className="odd:bg-slate-100 hover:bg-orange-200/[0.5] border-b border-slate-400/[0.5]">
                  <td className="font-medium text-sm text-[#464444] py-3 px-4">
                    {index + 1}
                  </td>
                  <td className="font-medium text-sm text-[#464444] py-3 px-4">
                    <p className="font-semibold text-slate-500">{doc.documentName}</p>
                    <p className="font-light text-xs">Pengirim : {doc.recipient}</p>
                  </td>
                  <td className="font-medium text-sm text-[#464444] py-3 px-4">
                    {doc.size}
                  </td>
                  <td className="font-medium text-sm text-[#464444] py-3 px-4">
                    {doc.date}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-4 justify-center">
                      <button>
                        <i className="bi bi-eye-fill text-xl cursor-pointer text-blue-500"></i>
                      </button>
                      <button>
                        <i className="bi bi-download text-xl cursor-pointer text-green-500"></i>
                      </button>
                      <button>
                        <i className="bi bi-trash text-xl cursor-pointer text-red-500"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.isOpen && <Create />}
        </Modal>
      )}
      </div>
    );
  };
  
  export default SharedStorage;
  