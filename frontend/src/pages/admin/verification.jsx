import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Sidebar from "../../components/Sidebar/SidebarAdmin";
import AdminHeader from "../../components/header/adminHeader";

const Verification = () => {
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
  }, [auth?.token, pagination.page]);

  // Handle Approve/Reject Actions for Doctors
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
          notif._id === notificationId
            ? { ...notif, loading: null, read: true, status: action }
            : notif
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
      setLoading(true);
    }
  };

  // Helper to render certificate for doctors
  const renderCertificate = (certificate) => {
    if (!certificate || !certificate.data || !certificate.contentType) {
      return <p className="text-slate-500 text-sm">No certificate provided</p>;
    }

    const dataUrl = `data:${certificate.contentType};base64,${certificate.data}`;
    
    if (certificate.contentType === "application/pdf") {
      return (
        <a
          href={dataUrl}
          download={`doctor_certificate.pdf`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
          aria-label="Download doctor certificate PDF"
        >
          Download Certificate (PDF)
        </a>
      );
    } else if (certificate.contentType.startsWith("image/")) {
      return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <img
            src={dataUrl}
            alt="Doctor Certificate"
            className="w-48 h-32 object-cover"
            onClick={() => window.open(dataUrl, "_blank")}
            aria-label="Click to view doctor certificate"
          />
        </div>
      );
    } else {
      return <p className="text-slate-500 text-sm">Unsupported certificate format</p>;
    }
  };

  // Helper to render notification content based on type
  const renderNotificationContent = (notification) => {
    if (notification.type === "doctor_registration" && notification.doctor) {
      return (
        <div className="space-y-4">
          <p className="text-slate-800 text-lg font-semibold">{notification.message}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <p><span className="font-semibold text-slate-900">Name:</span> {notification.doctor.name}</p>
            <p><span className="font-semibold text-slate-900">Email:</span> {notification.doctor.email}</p>
            <p><span className="font-semibold text-slate-900">Phone:</span> {notification.doctor.phone}</p>
            <p><span className="font-semibold text-slate-900">License No:</span> {notification.doctor.licenseNo}</p>
            <p><span className="font-semibold text-slate-900">Practice:</span> {notification.doctor.practice}</p>
            <p><span className="font-semibold text-slate-900">Location:</span> {notification.doctor.location}</p>
            <p><span className="font-semibold text-slate-900">Certificate:</span> {renderCertificate(notification.doctor.certificate)}</p>
          </div>
          <div className="flex items-center gap-3">
            {notification.status === "pending" ? (
              notification.loading ? (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-9h-1m-14 0H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                </svg>
              ) : (
                <>
                  <button
                    onClick={() =>
                      handleAction(notification.doctorId, "approve", notification._id)
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Approve doctor registration"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleAction(notification.doctorId, "reject", notification._id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Reject doctor registration"
                  >
                    Reject
                  </button>
                </>
              )
            ) : (
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="text-slate-900">Status:</span>
                <span
                  className={`${
                    notification.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {notification.status.charAt(0).toUpperCase() +
                    notification.status.slice(1)}
                </span>
              </p>
            )}
          </div>
        </div>
      );
    } else {
      return <p className="text-slate-700 text-base">{notification.message}</p>;
    }
  };

  // Filter out patient_registration notifications
  const filteredNotifications = notifications.filter(
    (notification) => notification.type !== "patient_registration"
  );

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
          onClick={() => handlePageChange(i)}
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
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Verification</h1>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-9h-1m-14 0H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
              </svg>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-600 text-lg">No notifications available.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-6 bg-white rounded-lg border ${
                      notification.read
                        ? "border-slate-200"
                        : "border-l-4 border-indigo-600"
                    }`}
                  >
                    {renderNotificationContent(notification)}
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

export default Verification;