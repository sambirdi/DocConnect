import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth"; // Assuming you have an auth context
import { NavLink } from "react-router-dom";
import BrowseSpecialties from "../../pages/browse"; // Adjust the import path

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [activeNav, setActiveNav] = useState([true, false, false, false]); // Initial active state for nav items
  const [showDropdown, setShowDropdown] = useState(false); // State to manage user dropdown visibility
  const [showBrowsePopup, setShowBrowsePopup] = useState(false); // State to manage browse popup visibility

  // Handle user logout
  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
  };

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth)); // Set the auth state from localStorage
    }
  }, [setAuth]);

  // Initialize activeNav from sessionStorage if available
  useEffect(() => {
    const savedActiveNav = JSON.parse(sessionStorage.getItem("NavbarMain"));
    if (savedActiveNav) {
      setActiveNav(savedActiveNav);
    }
  }, []);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (showBrowsePopup) {
      // Disable scroll on body
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      // Re-enable scroll on body
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [showBrowsePopup]);

  // Function to toggle browse popup
  const toggleBrowsePopup = (e) => {
    e.preventDefault(); // Prevent default navigation
    setShowBrowsePopup(!showBrowsePopup);
  };

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

        <div className="flex items-center gap-2">
          {auth.user ? (
            <div className="relative">
              {/* Username and dropdown */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white flex items-center gap-2"
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
                <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-md">
                  <NavLink
                    to={`/dashboard/${
                      auth.user.role === "admin"
                        ? "admin"
                        : auth.user.role === "doctor"
                        ? "doctor"
                        : "user"
                    }`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
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
            {/* Close Button */}
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

            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 px-6 pt-6 pb-4">
              Browse top specialties
            </h2>

            {/* Content */}
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