import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Sidebar from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";

const Verification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth(); // Removed setAuth since it's not used
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
    fetchNotifications();
  }, [auth?.token, pagination.page]); // Re-fetch when page changes

  // Handle Approve/Reject Actions
  const handleAction = async (doctorId, action, notificationId) => {
    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, loading: action } : notif
      )
    );

    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/approve-reject`,
        { doctorId, action },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      toast.success(response.data.message);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, loading: null, read: true } : notif
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing doctor:`, error);
      toast.error(`Failed to ${action} doctor`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, loading: null } : notif
        )
      );
    }
  };

  // Pagination Controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      setLoading(true); // Show loading spinner during page change
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        <AdminHeader />
        <h1 className="p-5 text-4xl font-bold">Verify Doctor</h1>
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
                    className={`p-4 mb-2 rounded ${
                      notification.read ? "bg-gray-300" : "bg-blue-100"
                    }`}
                  >
                    <p>{notification.message}</p>
                    {notification.doctorId && (
                      <div className="mt-2">
                        <p>
                          <strong>Doctor's Name:</strong> {notification.doctorId.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {notification.doctorId.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {notification.doctorId.phone}
                        </p>
                        <p>
                          <strong>License No:</strong> {notification.doctorId.licenseNo}
                        </p>
                      </div>
                    )}
                    {!notification.read && notification.doctorId && (
                      <div className="mt-2 flex items-center">
                        {notification.loading ? (
                          <span className="spinner-border inline-block w-4 h-4 border-4 rounded-full border-t-transparent border-blue-500 animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleAction(notification.doctorId._id, "approve", notification._id)
                              }
                              className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAction(notification.doctorId._id, "reject", notification._id)
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
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

export default Verification;