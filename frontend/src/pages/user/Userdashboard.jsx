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
  const location = useLocation();
  const DEFAULT_PHOTO = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'about';
  });

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

  useEffect(() => {
    const fetchUserInfoAndPhoto = async () => {
      if (!auth.token) return;
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/auth/user-info`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setUser(userResponse.data);

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
                    <span className="font-medium text-navy/90">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Phone:</span>
                    <span>+977 {user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-navy/90">Address:</span>
                    <span>{user?.location}</span>
                  </div>
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
    </div>
  );
}