import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";

const Message = () => {
  const { token, user } = useContext(AuthContext);
  const [isOpenModal, setOpenModal] = useState({
    isOpen: false,
    mode: "",
    data: null,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/announcements",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && Array.isArray(response.data.read)) {
        const userMessages = response.data.read.filter(
          (msg) => msg.sent_by === user.id
        );
        
        setMessages(userMessages);
      } else {
        console.error(
          "Error: Struktur data API tidak sesuai harapan!",
          response.data
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data pengumuman:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pengumuman yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/announcements/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire("Terhapus!", "Pengumuman berhasil dihapus.", "success");
          fetchMessages();
        } catch (error) {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus pengumuman.",
            "error"
          );
          console.error("Gagal menghapus pengumuman:", error);
        }
      }
    });
  };

  return (
    <div className="px-16 py-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl text-salt font-bold">Announcement</h1>
          <div className="text-slate-500 text-sm mt-3">
          View and manage the announcements you have made.
          </div>
        </div>
        <div>
          <i
            onClick={() => setOpenModal({ isOpen: true, mode: "create" })}
            className="bi bi-send-plus-fill bg-orange-100 px-5 py-5 cursor-pointer flex items-center justify-center rounded-lg border border-orange-500/[0.5]"
          ></i>
        </div>
      </div>
      <div className="border border-slate-500/[0.5] mt-8 mb-6"></div>
      <div className="flex gap-3 flex-col">
        {loading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="w-full h-12 bg-slate-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Tidak ada pengumuman yang Anda buat.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="w-full rounded-lg bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between"
              onClick={() =>
                setOpenModal({ isOpen: true, mode: "message", data: message })
              }
            >
              <div>
                <h1 className="text-slate-900 text-sm font-medium">
                  {message.title}
                </h1>
                <p className="text-slate-500 text-xs font-normal">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-5">
                <i
                  className="bi bi-pencil-square text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModal({ isOpen: true, mode: "edit", data: message });
                  }}
                ></i>
                <i
                  className="bi bi-trash-fill text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(message.id);
                  }}
                ></i>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpenModal.isOpen && (
        <Modal
          isOpen={isOpenModal.isOpen}
          setOpen={setOpenModal}
          mode={isOpenModal.mode}
        >
          {isOpenModal.mode === "create" ? (
            <Create
              onClose={() => setOpenModal({ isOpen: false })}
              refreshData={fetchMessages}
              userRole={user.role}
            />
          ) : isOpenModal.mode === "message" ? (
            <Show data={isOpenModal.data} />
          ) : (
            <Edit
              data={isOpenModal.data}
              onClose={() => setOpenModal({ isOpen: false })}
              refreshData={fetchMessages}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Message;
