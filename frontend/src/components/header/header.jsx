import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BrowseSpecialties from "../../pages/browse";
import { FiUser, FiLogOut } from "react-icons/fi";
import axios from "axios";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [activeNav, setActiveNav] = useState([true, false, false, false]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBrowsePopup, setShowBrowsePopup] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Axios instance with base URL
  const api = axios.create({
    baseURL: "http://localhost:5000",
  });

  // Handle user logout
  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, [setAuth]);

  // Initialize activeNav from sessionStorage if available
  useEffect(() => {
    const savedActiveNav = JSON.parse(sessionStorage.getItem("NavbarMain"));
    if (savedActiveNav) {
      setActiveNav(savedActiveNav);
    }
  }, []);

  // Fetch notifications for doctors
  useEffect(() => {
    const fetchNotifications = async () => {
      if (auth.user && auth.user.role === "doctor" && auth.token) {
        try {
          const response = await api.get("http://localhost:5000/api/doc-notification/notifications", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          if (response.data.success) {
            console.log("Fetched notifications:", response.data.notifications);
            setNotifications(response.data.notifications);
          } else {
            console.error("Fetch failed:", response.data.message);
            setNotifications([]);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error.response?.data || error.message);
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [auth.token, auth.user]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(
        `http://localhost:5000/api/doc-notification/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        console.log(`Marked notification ${notificationId} as read`);
        setNotifications((prev) => {
          const updated = prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          );
          console.log("Updated notifications:", updated);
          return [...updated];
        });
      } else {
        console.error("Mark as read failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error.response?.data || error.message);
    }
  };

  // Close browse popup when route changes
  useEffect(() => {
    setShowBrowsePopup(false);
  }, [location.pathname]);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (showBrowsePopup) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [showBrowsePopup]);

  // Function to toggle browse popup
  const toggleBrowsePopup = (e) => {
    e.preventDefault();
    setShowBrowsePopup(!showBrowsePopup);
  };

  // Function to toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
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

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl text-white font-bold flex items-center gap-1">
            <NavLink to="/">DocConnect</NavLink>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center space-x-8 text-white">
          <NavLink to="/">Home</NavLink>
          <a href="/browse" onClick={toggleBrowsePopup} className="cursor-pointer">
            Browse
          </a>
          <NavLink to="/about">About us</NavLink>
          {!auth.user && (
            <NavLink to="/doctorsignup">List your Practice</NavLink>
          )}
        </div>

        {/* User and Notification Section */}
        <div className="flex items-center gap-6">
          {auth.user && (
            <div className="relative">
              {/* Notification Icon */}
              <button
                onClick={toggleNotificationDropdown}
                className="text-white flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.491-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black border border-gray-300 rounded-lg shadow-md z-50">
                  <div className="px-4 py-2 font-semibold border-b border-gray-200">
                    Notifications
                  </div>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer ${
                            !notification.isRead ? "font-semibold" : ""
                          }`}
                          onClick={() => {
                            if (!notification.isRead) {
                              markAsRead(notification._id);
                            }
                            navigate(`/dashboard/doc-notifications`);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-600">
                                Rating: {notification.reviewId.rating}/5
                              </p>
                              <p className="text-xs text-gray-600 truncate max-w-[200px]">
                                "{notification.reviewId.reviewText}"
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {notifications.length > 3 && (
                        <div className="px-4 py-2 border-t border-gray-200">
                          <NavLink
                            to="/dashboard/doc-notifications"
                            className="w-full text-center block text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => setShowNotificationDropdown(false)}
                          >
                            Show All Notifications
                          </NavLink>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-800 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {auth.user ? (
            <div className="relative">
              {/* Username and dropdown */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition"
              >
                <span className="text-white">
                  {auth.user.fname ? auth.user.fname : auth.user.name}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-md z-50">
                  <NavLink
                    to={`/dashboard/${
                      auth.user.role === "admin"
                        ? "admin"
                        : auth.user.role === "doctor"
                        ? "doctor"
                        : "user"
                    }`}
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                  >
                    <FiUser className="text-lg" /> Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                  >
                    <FiLogOut className="text-lg" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login">
                <button className="px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-navy transition">
                  Sign In
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="px-4 py-2 bg-white text-navy rounded-full border border-white hover:bg-navy/100 hover:text-white transition">
                  Register
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Browse Popup */}
      {showBrowsePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto relative border border-gray-200">
            <button
              onClick={() => setShowBrowsePopup(false)}
              className="absolute top-4 right-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 px-6 pt-6 pb-4">
              Browse top specialties
            </h2>
            <div className="px-6 pb-6">
              <BrowseSpecialties showHeader={false} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;