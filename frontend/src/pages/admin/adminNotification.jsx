import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Sidebar from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);  // Initialize with true to show loading spinner initially
  const [auth, setAuth] = useAuth();

  // ✅ Fetch Notifications (with Authorization)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!auth?.token) {
        setLoading(false);  // Set loading to false if no token
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/admin/notifications`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications. Please log in again.");
      }
      setLoading(false);  // Set loading to false after the fetch attempt
    };
    fetchNotifications();
  }, [auth?.token]);  // Trigger when the token changes

  const handleAction = async (doctorId, action, notificationId) => {
    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;

    // Optimistic UI Update - immediately update the state to show loading
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, loading: action } : notif
      )
    );

    try {
      // Perform the action (approve or reject)
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

      // Update the notification status locally to reflect the change
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? { ...notif, loading: null, read: true } // Mark as read after action
            : notif
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing doctor:`, error);
      toast.error(`Failed to ${action} doctor`);

      // Rollback UI changes in case of an error (to avoid showing incorrect loading state)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, loading: null } : notif
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1">
        <AdminHeader />
        <h1 className="p-5 text-4xl font-bold">Notifications</h1>
        <div className="p-5">
          {/* Display Loading Spinner when fetching notifications */}
          {loading ? (
            <div className="flex justify-center items-center">
              <span className="spinner-border inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div>No notifications available.</div>  
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 mb-2 rounded ${notification.read ? "bg-gray-300" : "bg-blue-100"}`}
                >
                  <p>{notification.message}</p>
                  {/* Render doctor's details */}
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
                        <span className="spinner-border inline-block w-4 h-4 border-4 rounded-full border-t-transparent border-white animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(notification.doctorId, "approve", notification._id)}
                            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(notification.doctorId, "reject", notification._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
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
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;