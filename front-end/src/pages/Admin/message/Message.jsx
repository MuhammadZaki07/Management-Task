import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";
import { AuthContext } from "../../../context/AuthContext";

const Message = () => {
  const { token, user } = useContext(AuthContext);
  const [isOpenModal, setOpenModal] = useState({
    isOpen: false,
    mode: "",
    data: null,
  });
  const [messages, setMessages] = useState({ unread: [], read: [] });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/announcements",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengumuman:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Pengumuman ini akan dihapus secara permanen!",
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
          setMessages({
            unread: messages.unread.filter((msg) => msg.id !== id),
            read: messages.read.filter((msg) => msg.id !== id),
          });
          Swal.fire({
            title: "Deleted!",
            text: "Pengumuman berhasil dihapus.",
            icon: "success",
          });
        } catch (error) {
          console.error("Gagal menghapus pengumuman:", error);
          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.message || "Gagal menghapus pengumuman.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="px-20 py-10 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-500 text-sm">
            View and manage announcements for better communication.
          </p>
        </div>
        <button
          onClick={() => setOpenModal({ isOpen: true, mode: "create" })}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 cursor-pointer"
        >
          + Create
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 py-10">
        {["unread", "read"].map((type) => (
          <div key={type}>
            <h2 className="text-lg font-semibold mb-2">
              {type === "unread" ? "Unread Messages" : "Read Messages"}
            </h2>
            <div className="flex flex-col gap-4">
              {messages[type].length === 0 ? (
                <p className="text-gray-500 text-sm">Tidak ada pesan.</p>
              ) : (
                messages[type].map((message) => (
                  <div
                    key={message.id}
                    className={`w-full rounded-lg py-4 px-6 flex items-center justify-between cursor-pointer border border-slate-300/[0.5] ${
                      type === "unread" ? "bg-white" : "bg-gray-100"
                    }`}
                    onClick={() =>
                      setOpenModal({
                        isOpen: true,
                        mode: "message",
                        data: message,
                      })
                    }
                  >
                    <div>
                      <h1 className="text-gray-800 text-sm font-medium">
                        {message.title}
                      </h1>
                      <p className="text-gray-500 text-xs">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {message.sent_by === user.id && (
                        <button
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenModal({
                              isOpen: true,
                              mode: "edit",
                              data: message,
                            });
                          }}
                        >
                          ✏️
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
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
