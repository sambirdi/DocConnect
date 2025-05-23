import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Sidebar from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!auth?.token) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/admin/notifications/unread/count`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (response.data.success) {
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [auth?.token]);

  // Mark notification as read
  const handleMarkAsRead = async (notification) => {
    try {
      const endpoint = notification.type === 'doctor_registration' || notification.type === 'patient_registration'
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
        setUnreadCount((prev) => Math.max(0, prev - 1));

        const updatedResponse = await axios.get(`http://localhost:5000/api/admin/all-notifications`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        });

        setNotifications(updatedResponse.data.notifications);
        setPagination((prev) => ({
          ...prev,
          total: updatedResponse.data.pagination.total,
          pages: updatedResponse.data.pagination.pages,
        }));

        const countResponse = await axios.get(`http://localhost:5000/api/admin/notifications/unread/count`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (countResponse.data.success) {
          setUnreadCount(countResponse.data.unreadCount);
        }
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

  // Generate pagination numbers
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-lg text-slate-700 hover:bg-indigo-100"
          aria-label="Go to page 1"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="px-2 py-1 text-slate-500">...</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)} // Fixed typo: removed "Tennis"
          className={`px-3 py-1 rounded-lg ${
            pagination.page === i
              ? "bg-indigo-600 text-white"
              : "text-slate-700 hover:bg-indigo-100"
          }`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pagination.pages) {
      if (endPage < pagination.pages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="px-2 py-1 text-slate-500">...</span>
        );
      }
      pageNumbers.push(
        <button
          key={pagination.pages}
          onClick={() => handlePageChange(pagination.pages)}
          className="px-3 py-1 rounded-lg text-slate-700 hover:bg-indigo-100"
          aria-label={`Go to page ${pagination.pages}`}
        >
          {pagination.pages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <AdminHeader />
        <div className="max-w-6xl mx-auto p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Notifications older than 15 days are automatically removed.
          </p>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-9h-1m-14 0H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
              </svg>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-600 text-lg">No notifications available.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-6 bg-white rounded-lg border flex justify-between items-start ${
                      notification.read
                        ? "border-slate-200"
                        : "border-l-4 border-indigo-600"
                    }`}
                  >
                    <div className="space-y-4">
                      <p className="text-slate-800 text-lg font-semibold">{notification.message}</p>
                      {notification.type === 'doctor_registration' && notification.doctor && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                          <p><span className="font-semibold text-slate-900">Name:</span> {notification.doctor.name}</p>
                          <p><span className="font-semibold text-slate-900">License No:</span> {notification.doctor.licenseNo}</p>
                          <p><span className="font-semibold text-slate-900">Email:</span> {notification.doctor.email}</p>
                          <p><span className="font-semibold text-slate-900">Practice:</span> {notification.doctor.practice}</p>
                        </div>
                      )}
                      {notification.type === 'patient_registration' && notification.patient && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                          <p><span className="font-semibold text-slate-900">Name:</span> {notification.patient.name}</p>
                          <p><span className="font-semibold text-slate-900">Email:</span> {notification.patient.email}</p>
                          {/* <p><span className="font-semibold text-slate-900">Phone:</span> {notification.patient.phone}</p> */}
                        </div>
                      )}
                      {notification.type === 'flagged_review' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                          {notification.doctor && (
                            <p><span className="font-semibold text-slate-900">Doctor:</span> {notification.doctor.name}</p>
                          )}
                          {notification.patient && (
                            <p><span className="font-semibold text-slate-900">Patient:</span> {notification.patient.name}</p>
                          )}
                          {notification.review && (
                            <>
                              <p><span className="font-semibold text-slate-900">Review:</span> {notification.review.reviewText}</p>
                              <p><span className="font-semibold text-slate-900">Rating:</span> {notification.review.rating} stars</p>
                            </>
                          )}
                          {notification.flaggedReview && (
                            <p><span className="font-semibold text-slate-900">Reason for Flag:</span> {notification.flaggedReview.reason}</p>
                          )}
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification)}
                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Mark notification as read"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <div className="flex gap-1">{renderPaginationNumbers()}</div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
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