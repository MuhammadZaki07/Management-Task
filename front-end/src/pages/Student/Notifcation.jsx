import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import ShowNotification from "../Teacher/ShowNotification";
import Modal from "../../components/Modal";

const Notification = () => {
  const { token, user } = useContext(AuthContext);
  const [isOpenModal, setOpenModal] = useState({ isOpen: false, mode: "", data: null });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.notifications)) {
        const userNotifications = response.data.notifications.filter((notif) => notif.user_id === user.id);
        setNotifications(userNotifications);
      } else {
        console.error("Error: Unexpected API response structure!", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    Swal.fire({
      title: "Delete Notification?",
      text: "This notification will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8000/api/notifications/destroy", {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: [id] },
          });

          setNotifications((prev) => prev.filter((notif) => notif.id !== id));
          Swal.fire("Deleted!", "Notification has been successfully deleted.", "success");
        } catch (error) {
          console.error("Failed to delete notification:", error);
          Swal.fire("Error", "An error occurred while deleting.", "error");
        }
      }
    });
  };

  const deleteReadNotifications = async () => {
    const readNotifications = notifications.filter((notif) => notif.is_read === 1).map((notif) => notif.id);
    const unreadExists = notifications.some((notif) => notif.is_read === 0);

    if (unreadExists) {
      Swal.fire("Warning", "There are still unread notifications!", "warning");
      return;
    }

    if (readNotifications.length === 0) {
      Swal.fire("Info", "There are no read notifications to delete.", "info");
      return;
    }

    Swal.fire({
      title: "Delete All Read Notifications?",
      text: "All read notifications will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("http://localhost:8000/api/notifications/destroy", {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: readNotifications },
          });

          setNotifications((prev) => prev.filter((notif) => notif.is_read === 0));
          Swal.fire("Deleted!", "Read notifications have been successfully deleted.", "success");
        } catch (error) {
          console.error("Failed to delete notifications:", error);
          Swal.fire("Error", "An error occurred while deleting.", "error");
        }
      }
    });
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: 1 } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };
  

  return (
    <div className="px-16 py-10">
      <div className="flex justify-between">
        <h1 className="text-4xl text-salt font-bold">Notification</h1>
        <button
          onClick={deleteReadNotifications}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={notifications.every((notif) => notif.is_read === 0)}
        >
          Delete All
        </button>
      </div>
      <div className="border border-slate-500/[0.5] mt-8 mb-6"></div>
      <div className="flex gap-3 flex-col">
        {loading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <div key={index} className="w-full h-13 bg-slate-200 animate-pulse rounded-lg"></div>
            ))}
          </>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications for you.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`w-full rounded-lg bg-white border border-slate-300/[0.5] py-3.5 px-8 flex items-center cursor-pointer justify-between relative ${
                notif.is_read ? "opacity-50" : ""
              }`}
              onClick={() => {
                markAsRead(notif.id);
                setOpenModal({ isOpen: true, mode: "message", data: notif });
              }}              
            >
              {!notif.is_read && <div className="w-3 h-3 rounded-full bg-red-500 absolute -right-1 -top-1"></div>}
              <div>
                <h1 className="text-slate-900 text-sm font-medium">{notif.message}</h1>
                <p className="text-slate-500 text-xs font-normal">
                  {new Date(notif.created_at).toLocaleDateString()}
                </p>
              </div>
              <i
                className="bi bi-trash-fill text-lg text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
              ></i>
            </div>
          ))
        )}
      </div>

      {isOpenModal.isOpen && (
        <Modal isOpen={isOpenModal.isOpen} setOpen={setOpenModal} mode={isOpenModal.mode}>
          <ShowNotification data={isOpenModal.data} />
        </Modal>
      )}
    </div>
  );
};

export default Notification;
