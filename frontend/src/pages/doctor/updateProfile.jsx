import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile({ user, onProfileUpdate }) {
    const [formData, setFormData] = useState(user || {});
    const [selectedFile, setSelectedFile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null); // Store the current displayed photo URL
    const [auth] = useAuth();
    const navigate = useNavigate();
    const DEFAULT_PHOTO = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

    // Fetch photo from DB on mount or auth/user change
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
            setPhotoUrl(blobUrl); // Set initial DB photo or updated DB photo
        } catch (error) {
            console.error('Error fetching photo:', error.response?.status, error.message);
            setPhotoUrl(DEFAULT_PHOTO);
        }
    };

    useEffect(() => {
        setFormData(user || {});

        const userId = auth?.user?.id || user?._id; // Use id from JWT or _id from prop
        fetchPhoto(userId);
    }, [auth, user]);

    // Handle changes in form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file selection (preview new image immediately)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file); // Preview the new image
            setPhotoUrl(previewUrl); // Update photoUrl for preview
        }
    };

    // Save profile changes and update photo permanently
    const handleSave = async () => {
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        if (selectedFile) {
            formDataToSend.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/doctor/update-docprofile`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                const updatedUser = response.data.updatedUser;
                setFormData(updatedUser);

                const userId = updatedUser.id || auth.user.id || updatedUser._id;
                if (selectedFile) {
                    const newPhotoUrl = URL.createObjectURL(selectedFile); // Use new photo permanently
                    setPhotoUrl(newPhotoUrl);
                    onProfileUpdate(updatedUser, newPhotoUrl);
                } else {
                    await fetchPhoto(userId); // Fetch updated DB photo
                    onProfileUpdate(updatedUser, photoUrl);
                }

                setSelectedFile(null); // Clear selected file after save
                navigate('/dashboard/doctor?tab=about');
            } else {
                console.log('Error from server:', response.data.message);
            }
        } catch (error) {
            console.error('Error while updating profile:', error);
        }
    };

    const displayPhotoUrl = photoUrl || DEFAULT_PHOTO;

    if (!auth?.token) {
        console.log("Rendering loading state due to missing token.");
        return <p>Loading profile...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
            <h1 className="text-2xl font-semibold text-navy/90 mb-6">Edit Profile</h1>
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 flex-shrink-0">
                        <img
                            src={displayPhotoUrl}
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover border-2 border-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="practice" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                            type="text"
                            name="practice"
                            id="practice"
                            value={formData.practice || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your specialization"
                        />
                    </div>
                    <div>
                        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                        <input
                            type="text"
                            name="qualification"
                            id="qualification"
                            value={formData.qualification || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your qualification"
                        />
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                        <input
                            type="text"
                            name="experience"
                            id="experience"
                            value={formData.experience || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your experience"
                        />
                    </div>
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <input
                            type="text"
                            name="institution"
                            id="institution"
                            value={formData.institution || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your institution"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your phone"
                        />
                    </div>
                    {/* <div className="sm:col-span-2"> */}
                    <div>
                        <label htmlFor="workplace" className="block text-sm font-medium text-gray-700 mb-1">Workplace</label>
                        <input
                            type="text"
                            name="workplace"
                            id="workplace"
                            value={formData.workplace || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your workplace"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your location"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            id="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                        >
                           <option value="" disabled>Select your gender</option>
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                           <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                        <textarea
                            name="about"
                            id="about"
                            value={formData.about || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200 min-h-[150px]"
                            placeholder="Tell us about yourself"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-navy/90 text-white rounded-full font-medium hover:bg-navy/80 focus:ring-navy/60 focus:ring-offset-2 transition duration-300"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}