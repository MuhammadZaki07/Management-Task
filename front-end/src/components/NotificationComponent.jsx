import { useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const NotificationComponent = () => {
    const { user } = useContext(AuthContext);
    const [seenNotifications, setSeenNotifications] = useState(
        JSON.parse(localStorage.getItem("seenNotifications")) || []
    );

    useEffect(() => {
        if (!user) return;

        axios
            .get("http://localhost:8000/api/notifications", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                if (response.data.notifications.length > 0) {
                    const latestNotification = response.data.notifications[0];

                    // ✅ Cek apakah ID notifikasi sudah ada di localStorage
                    if (!seenNotifications.includes(latestNotification.id)) {
                        showNotification(latestNotification);
                        updateSeenNotifications(latestNotification.id);
                    }
                }
            })
            .catch((error) => console.error("Error fetching notifications:", error));

        // Setup Pusher untuk real-time update
        const pusher = new Pusher("c71a1bede9e4e906d478", { cluster: "ap1", encrypted: true });

        const channel = pusher.subscribe(`notifications.${user.id}`);

        channel.bind("new-notification", (data) => {
            if (data.notification.user_id === user.id) {
                if (!seenNotifications.includes(data.notification.id)) {
                    showNotification(data.notification);
                    updateSeenNotifications(data.notification.id);
                }
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [user, seenNotifications]);

    const showNotification = (notification) => {
        toast.success(notification.message, {
            duration: 5000,
            style: { background: "#FFFF", color: "black", borderRadius: "8px", padding: "12px 16px" },
            position: "top-right",
        });
    };

    const updateSeenNotifications = (id) => {
        const updatedNotifications = [...seenNotifications, id];
        setSeenNotifications(updatedNotifications);
        localStorage.setItem("seenNotifications", JSON.stringify(updatedNotifications));
    };

    return <Toaster />;
};

export default NotificationComponent;
