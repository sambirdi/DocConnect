import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import Header from "../../components/header/header";

const DoctorNotification = () => {
  const [auth] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (auth.user && auth.user.role === "doctor" && auth.token) {
        try {
          setLoading(true);
          const response = await axios.get("http://localhost:5000/api/doc-notification/notifications", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          if (response.data.success) {
            setNotifications(response.data.notifications);
          } else {
            setError("Failed to load notifications");
          }
        } catch (err) {
          console.error("Error fetching notifications:", err);
          setError("An error occurred while loading notifications");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("You must be a doctor to view notifications");
      }
    };

    fetchNotifications();
  }, [auth]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/doc-notification/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-gradient-to-br from-navy/90 to-gray-800">
        <Header />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Notifications
        </h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading notifications...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition ${!notification.isRead ? "font-semibold bg-gray-50" : ""
                  }`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-base text-gray-800">{notification.message}</p>
                    {notification.reviewId ? (
                      <>
                        <p className="text-sm text-gray-600">
                          Rating: {notification.reviewId.rating}/5
                        </p>
                        <p className="text-sm text-gray-600">
                          "{notification.reviewId.reviewText.length > 100
                            ? `${notification.reviewId.reviewText.substring(0, 100)}...`
                            : notification.reviewId.reviewText}"
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">No review details available</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNotification;