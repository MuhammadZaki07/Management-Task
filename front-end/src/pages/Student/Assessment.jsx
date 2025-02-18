import { useState } from "react";
import Modal from "../../components/Modal";
import Submission from "./Submission";

const Assessment = () => {
    const data = [
        { id: 1, task: "Task CRUD Laravel", teacher: "Sri Eka", subject: "Rekayasa Perangkat Lunak", value: 100 },
        { id: 2, task: "Task UI/UX Design", teacher: "Andi Saputra", subject: "Desain Komunikasi Visual", value: 85 },
        { id: 3, task: "Task Database MySQL", teacher: "Budi Santoso", subject: "Basis Data", value: 90 },
        { id: 4, task: "Task API Development", teacher: "Citra Dewi", subject: "Pemrograman Web", value: 60 },
        { id: 5, task: "Task Jaringan Komputer", teacher: "Dian Prasetyo", subject: "Jaringan Komputer", value: 78 },
        { id: 6, task: "Task Algoritma", teacher: "Eko Wijaya", subject: "Struktur Data", value: 72 },
        { id: 7, task: "Task ReactJS", teacher: "Fajar Hidayat", subject: "Pemrograman Web", value: 95 },
        { id: 8, task: "Task Cyber Security", teacher: "Gita Lestari", subject: "Keamanan Jaringan", value: 68 },
        { id: 9, task: "Task Data Science", teacher: "Hadi Pranata", subject: "Machine Learning", value: 82 },
        { id: 10, task: "Task Mobile Dev", teacher: "Indah Permata", subject: "Pemrograman Mobile", value: 74 },
      ];
    
      const [isOpenModal,setOpenModal] = useState(false);
  return (
    <div className="px-16 w-full">
           <div className="w-full px-16 py-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-4xl text-salt font-bold">Data Assesment</h1>
          <p className="text-slate-500 text-sm font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, magnam!
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-white text-slate-500 font-semibold text-left">
            <tr className="h-12">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Task Name</th>
              <th className="px-4 py-2">Teacher Name</th>
              <th className="px-4 py-2">Subjects</th>
              <th className="px-4 py-2">Your Value</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="text-left">
            {data.map((item,index) => (
            <tr key={index + 1} className="h-12 bg-white text-base font-light odd:bg-slate-100 border-b border-slate-300/[0.5]">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.task}</td>
                <td className="px-4 py-2">{item.teacher}</td>
                <td className="px-4 py-2">{item.subject}</td>
                <td className={`px-4 py-2 flex gap-4 items-center font-semibold ${item.value <= 75 ? 'text-red-600' : 'text-green-700'}`}>
                    <div className="flex gap-4">
                    {item.value <= 75 ? <>
                    <div className="w-5 h-5 rounded-full animate-pulse-fast bg-red-500"></div>
                    </> : <div className="w-5 h-5 rounded-full bg-green-500"></div>}
                    </div>
                    {item.value}
                </td>
                {item.value <= 75 ? (
                <td className={`px-4 py-2 font-semibold`}>
                    <button onClick={() => setOpenModal(true)}>
                        <i className="bi bi-exclamation-square-fill text-2xl text-yellow-400"></i>
                    </button>
                </td>
                ) : 
                <td className="px-4 py-2"></td>
                }
            </tr>
            ))}
          </tbody>
        </table>
      </div>
        {isOpenModal && <Modal isOpen={isOpenModal} setOpen={setOpenModal} mode={`Reason`}>
        <Submission/>    
        </Modal>}
    </div>
  )
}

export default Assessment