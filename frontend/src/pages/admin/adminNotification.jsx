import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1,
  });

  // Fetch Notifications with Pagination
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!auth?.token) {
        toast.error("Please log in to view notifications");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/admin/all-notifications`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        });

        setNotifications(response.data.notifications);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        }));
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [auth?.token, pagination.page]);

  // Mark notification as read
  const handleMarkAsRead = async (notification) => {
    try {
      const endpoint = notification.type === 'doctor_registration'
        ? `http://localhost:5000/api/admin/notifications/${notification._id}/read`
        : `http://localhost:5000/api/admin/flagged-notifications/${notification._id}/read`;

      const response = await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.data.success) {
        toast.success("Notification marked as read");
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notification._id ? { ...notif, read: true } : notif
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(error.response?.data?.message || "Failed to mark notification as read");
    }
  };

  // Pagination Controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <AdminHeader />
        <h1 className="p-5 text-4xl font-bold">Notifications</h1>
        <div className="p-5">
          {loading ? (
            <div className="flex justify-center items-center">
              <span className="spinner-border inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-500">No notifications available.</div>
          ) : (
            <>
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 mb-2 rounded flex justify-between items-start ${
                      notification.read ? "bg-gray-300" : "bg-blue-100"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{notification.message}</p>
                      {notification.type === 'doctor_registration' && notification.doctor && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p><strong>Doctor's Name:</strong> {notification.doctor.name}</p>
                          <p><strong>License No:</strong> {notification.doctor.licenseNo}</p>
                          <p><strong>Email:</strong> {notification.doctor.email}</p>
                          <p><strong>Practice:</strong> {notification.doctor.practice}</p>
                        </div>
                      )}
                      {notification.type === 'flagged_review' && (
                        <div className="mt-2 text-sm text-gray-600">
                          {notification.doctor && (
                            <p><strong>Doctor:</strong> {notification.doctor.name}</p>
                          )}
                          {notification.patient && (
                            <p><strong>Patient:</strong> {notification.patient.name}</p>
                          )}
                          {notification.review && (
                            <>
                              <p><strong>Review:</strong> {notification.review.reviewText}</p>
                              <p><strong>Rating:</strong> {notification.review.rating} stars</p>
                            </>
                          )}
                          {notification.flaggedReview && (
                            <p><strong>Reason for Flag:</strong> {notification.flaggedReview.reason}</p>
                          )}
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 hover:bg-navy hover:text-white"
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 hover:bg-navy hover:text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;