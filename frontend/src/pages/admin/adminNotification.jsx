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
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1,
  });

  const fetchNotifications = async () => {
    if (!auth?.token) {
      toast.error("Please log in to view notifications");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/admin/notifications`, {
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

  useEffect(() => {
    fetchNotifications();
  }, [auth?.token, pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      setLoading(true);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // First check if this is a doctor registration notification
      if (notification.message.includes("registered and is awaiting approval") && notification.doctorId) {
        // Navigate to verification page first
        navigate('/dashboard/verification');
        
        // Then mark as read if it wasn't read
        if (!notification.read) {
          await axios.put(
            `http://localhost:5000/api/admin/notifications/${notification._id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

          // Update notification state locally
          setNotifications((prev) =>
            prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
          );
        }
      } else if (!notification.read) {
        // For other notifications, just mark as read
        await axios.put(
          `http://localhost:5000/api/admin/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        // Update notification state locally
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <AdminHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500 p-8">No notifications available.</div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                      notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <p className={`text-gray-800 mb-2 ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                        {notification.doctorId && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Doctor:</span> {notification.doctor.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {notification.doctor.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">License No:</span> {notification.doctor.licenseNo}
                            </p>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {notifications.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;