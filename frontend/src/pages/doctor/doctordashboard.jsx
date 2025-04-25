import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/auth";
import axios from 'axios';
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Header from '../../components/header/header';
import EditProfilePage from './updateProfile';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isActive, setIsActive] = useState(false); // Track account active status
    const [statusLoading, setStatusLoading] = useState(false); // Loading for activate/deactivate
    const location = useLocation();
    const DEFAULT_PHOTO = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
    
    // State for confirmation dialog
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        action: null,
    });

    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'about';
    });

    // Fetch user photo
    const fetchPhoto = async (userId) => {
        if (!auth?.token || !userId) {
            setPhotoUrl(DEFAULT_PHOTO);
            return;
        }

        try {
            const cacheBuster = new Date().getTime();
            const photoResponse = await axios.get(
                `http://localhost:5000/api/doctor/doc-photo/${userId}?t=${cacheBuster}`,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                    responseType: 'blob',
                }
            );
            const blobUrl = URL.createObjectURL(photoResponse.data);
            setPhotoUrl(blobUrl);
        } catch (error) {
            console.error('Error fetching photo:', error.response?.status, error.message);
            setPhotoUrl(DEFAULT_PHOTO);
        }
    };

    // Fetch user info and account status
    useEffect(() => {
        const fetchUserInfoAndPhoto = async () => {
            if (!auth.token) return;
            try {
                const userResponse = await axios.get(`http://localhost:5000/api/auth/user-info`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setUser(userResponse.data);
                setIsActive(userResponse.data.isActive || false); // Set initial isActive status

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
    }, [auth.token]);

    // Handle profile update
    const handleProfileUpdate = (updatedUser, newPhotoUrl) => {
        setUser(updatedUser);
        setIsActive(updatedUser.isActive || false); // Update isActive if changed
        setPhotoUrl(newPhotoUrl || photoUrl);
        setActiveTab('about');
        setAuth((prev) => ({ ...prev, user: updatedUser }));
    };

    // Handle account activation
    const handleActivateAccount = async () => {
        setStatusLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/api/doctor/account/activate`,
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
                alert('Account activated successfully!');
            }
        } catch (error) {
            console.error('Error activating account:', error);
            alert(error.response?.data?.message || 'Failed to activate account');
        } finally {
            setStatusLoading(false);
        }
    };

    // Handle account deactivation
    const handleDeactivateAccount = async () => {
        setStatusLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:5000/api/doctor/account/deactivate`,
                {},
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
            if (response.data.success) {
                setIsActive(false);
                setUser((prev) => ({ ...prev, isActive: false }));
                setAuth((prev) => ({
                    ...prev,
                    user: { ...prev.user, isActive: false },
                }));
                if (response.data.logout) {
                    setAuth({ token: null, user: null });
                    localStorage.removeItem('auth');
                    navigate('/login');
                    // alert('Account deactivated successfully! You have been logged out.');
                } else {
                    alert('Account deactivated successfully!');
                }
            }
        } catch (error) {
            console.error('Error deactivating account:', error.response?.data);
            const message = error.response?.data?.message || 'Failed to deactivate account. Please ensure you are logged in as a doctor.';
            alert(message);
        } finally {
            setStatusLoading(false);
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
    const handleConfirmAction = () => {
        if (confirmDialog.action === 'deactivate') {
            handleDeactivateAccount();
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

    const userPhotoUrl = selectedFile
        ? URL.createObjectURL(selectedFile)
        : auth?.user?._id
        ? `http://localhost:5000/api/doctor/doc-photo/${auth.user._id}`
        : DEFAULT_PHOTO;

    const handleImageError = (e) => {
        e.target.src = DEFAULT_PHOTO;
    };

    if (!auth.token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="bg-gradient-to-br from-navy/90 to-gray-700 relative">
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
                                            onError={handleImageError}
                                        />
                                    </div>
                                </div>
                                <div className="text-center mt-6">
                                    <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                                    <p className="text-indigo-100 mt-2">{user?.practice}</p>
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
                                        <span className="font-medium text-navy/90">Location:</span>
                                        <span>{user?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-navy/90">Specialization:</span>
                                        <span>{user?.practice}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-navy/90">License No:</span>
                                        <span>{user?.licenseNo}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-navy/90">Institution:</span>
                                        <span>{user?.institution}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-navy/90">Experience:</span>
                                        <span>{user?.experience}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-navy/90">Workplace:</span>
                                        <span>{user?.workplace}</span>
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
                                        disabled={statusLoading || !user?.isApproved}
                                        className={`w-full py-3 rounded-full font-medium transition-all duration-300 text-base ${
                                            isActive
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        } ${statusLoading || !user?.isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {statusLoading
                                            ? 'Processing...'
                                            : isActive
                                            ? 'Deactivate Account'
                                            : 'Activate Account'}
                                    </button>
                                    {!user?.isApproved && (
                                        <p className="text-red-500 text-sm mt-2">
                                            Account must be approved to activate.
                                        </p>
                                    )}
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
                                    <EditProfilePage user={user} onProfileUpdate={handleProfileUpdate} />
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-gray-50 rounded-lg shadow-lg border p-6">
                                            <h2 className="text-2xl font-semibold text-navy/90 mb-4">About Me</h2>
                                            <p className="text-gray-600 leading-relaxed text-base">
                                                {user?.about || "No information available yet. Update your profile to add more details!"}
                                            </p>
                                        </div>
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
                                                    <span className="font-medium">Location:</span>
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

            {/* Custom Confirmation Dialog */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Deactivate Account</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to deactivate your account?
                            <span className="block text-sm text-red-500 mt-1">This action will log you out of the system.</span>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeConfirmDialog}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}