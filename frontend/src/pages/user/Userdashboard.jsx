import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/auth";
import axios from 'axios';
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Header from '../../components/header/header';
import EditProfilePage from '../../pages/user/EditProfile';
import { useNavigate, useLocation } from 'react-router-dom';

export default function UserDashboard() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const location = useLocation();
  const DEFAULT_PHOTO = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
  });

  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    message: '',
    isError: false,
    onClose: null
  });

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'about';
  });

  const fetchPhoto = async (userId) => {
    // For patients, always use the default photo
    setPhotoUrl(DEFAULT_PHOTO);
  };

  useEffect(() => {
    const fetchUserInfoAndPhoto = async () => {
      if (!auth.token) return;
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/auth/user-info`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUser(userResponse.data);
        setIsActive(userResponse.data.isActive || false);

        const userId = userResponse.data.id || userResponse.data._id;
        await fetchPhoto(userId);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data or photo:', err);
        setError('Error fetching user data or photo');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfoAndPhoto();
  }, [auth.token, fetchPhoto]);

  const handleProfileUpdate = (updatedUser, newPhotoUrl) => {
    setUser(updatedUser);
    setPhotoUrl(newPhotoUrl || photoUrl);
    setActiveTab('about');
    setAuth((prev) => ({ ...prev, user: updatedUser }));
  };

  const userPhotoUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : auth?.user?._id
    ? `http://localhost:5000/api/doctor/doc-photo/${auth.user._id}`
    : DEFAULT_PHOTO;

  const handleImageError = (e) => {
    e.target.src = DEFAULT_PHOTO;
  };

  // Handle account activation
  const handleActivateAccount = async () => {
    setStatusLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/patient/account/activate`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (response.data.success) {
        setIsActive(true);
        setUser((prev) => ({ ...prev, isActive: true }));
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, isActive: true },
        }));
        setSuccessDialog({
          isOpen: true,
          message: 'Account activated successfully!',
          onClose: () => setSuccessDialog({ isOpen: false, message: '', onClose: null })
        });
      }
    } catch (error) {
      console.error('Error activating account:', error);
      setSuccessDialog({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to activate account',
        isError: true,
        onClose: () => setSuccessDialog({ isOpen: false, message: '', isError: false, onClose: null })
      });
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    setStatusLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/patient/account/deactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (response.data.success) {
        setIsActive(false);
        setUser((prev) => ({ ...prev, isActive: false }));
        
        // Show success modal first
        setSuccessDialog({
          isOpen: true,
          message: 'Account deactivated successfully! You will be logged out.',
          onClose: () => {
            setSuccessDialog({ isOpen: false, message: '', onClose: null });
            // Clear auth state and local storage after modal is closed
            setAuth({ token: null, user: null });
            localStorage.removeItem('auth');
            navigate('/login');
          }
        });
      }
    } catch (error) {
      console.error('Error deactivating account:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to deactivate account. Please ensure you are logged in as a patient.';
      setSuccessDialog({
        isOpen: true,
        message: message,
        isError: true,
        onClose: () => setSuccessDialog({ isOpen: false, message: '', isError: false, onClose: null })
      });
    } finally {
      setStatusLoading(false);
      closeConfirmDialog();
    }
  };

  // Open confirmation dialog
  const openConfirmDialog = (action) => {
    setConfirmDialog({ isOpen: true, action });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  // Handle confirmation
  const handleConfirmAction = async () => {
    if (confirmDialog.action === 'deactivate') {
      await handleDeactivateAccount();
    }
    closeConfirmDialog();
  };

  // Toggle account status
  const handleToggleStatus = () => {
    if (isActive) {
      openConfirmDialog('deactivate');
    } else {
      handleActivateAccount();
    }
  };

  if (!auth.token) {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-navy">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-12 border border-indigo-100 min-h-[500px]">
              <div className="bg-navy/90 p-6">
                <div className="flex justify-center">
                  <div className="relative h-28 w-28">
                    <img
                      src={photoUrl || DEFAULT_PHOTO}
                      alt="Profile preview"
                      className="h-full w-full rounded-full object-cover border-2 border-indigo-200"
                    />
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                  <p className="text-indigo-100 mt-2">Patient</p>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-navy/90 mb-6">Basic Info</h3>
                <div className="space-y-4 text-gray-600 text-base">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Name:</span>
                    <span>{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Phone:</span>
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Location:</span>
                    <span>{user?.location || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Account Status:</span>
                    <span className={isActive ? 'text-green-600' : 'text-red-600'}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleToggleStatus}
                    disabled={statusLoading}
                    className={`w-full py-3 rounded-full font-medium transition-all duration-300 text-base ${
                      isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    } ${statusLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {statusLoading
                      ? 'Processing...'
                      : isActive
                      ? 'Deactivate Account'
                      : 'Activate Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Tabbed Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-h-[500px]">
              <nav className="flex gap-2 p-6 bg-gray-50 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 text-base ${activeTab === "about" ? "bg-navy/90 text-white shadow-md" : "text-navy/90 hover:bg-navy/20"}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 text-base ${activeTab === "edit" ? "bg-navy/90 text-white shadow-md" : "text-navy/90 hover:bg-navy/20"}`}
                >
                  Edit Profile
                </button>
              </nav>
              <div className="p-8">
                {activeTab === "edit" ? (
                      <EditProfilePage user={user} onProfileUpdate={handleProfileUpdate} setSuccessDialog={setSuccessDialog} />
                ) : (
                  <div className="space-y-8">
                    <div className="bg-gray-50 rounded-lg shadow-lg border p-6">
                      <h2 className="text-2xl font-semibold text-navy/90 mb-4">Contact Information</h2>
                      <div className="space-y-5 text-gray-600 text-base">
                        <div className="flex items-center gap-4">
                          <FiMail className="text-navy/80 text-base" />
                          <span className="font-medium">Email:</span>
                          <a href={`mailto:${user?.email}`} className="text-navy/90 hover:text-navy/60 transition duration-300">
                            {user?.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-4">
                          <FiMapPin className="text-navy/80 text-base" />
                          <span className="font-medium">Address:</span>
                          <span>{user?.location}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <FiPhone className="text-navy/80 text-base" />
                          <span className="font-medium">Phone:</span>
                          <span>+977 {user?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 transform transition-all">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Deactivate Account</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to deactivate your account?
              </p>
              <p className="text-sm text-red-500 mb-8">
                This action will log you out of the system.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeConfirmDialog}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Dialog */}
      {successDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 transform transition-all">
            <div className="text-center">
              {/* Icon */}
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${
                successDialog.isError ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {successDialog.isError ? (
                  <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              <h2 className={`text-2xl font-bold mb-4 ${successDialog.isError ? 'text-red-600' : 'text-green-600'}`}>
                {successDialog.isError ? 'Error' : 'Success'}
              </h2>
              <p className="text-gray-600 mb-8">
                {successDialog.message}
              </p>
              
              <button
                onClick={successDialog.onClose}
                className={`w-full px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  successDialog.isError
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                }`}
              >
                {successDialog.isError ? 'Try Again' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  