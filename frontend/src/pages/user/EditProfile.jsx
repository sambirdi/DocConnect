import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ user, onProfileUpdate, setSuccessDialog }) {
    const [formData, setFormData] = useState(() => (user || {}));
    const [auth] = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSave = async () => {
        // Validate phone number
        if (formData.phone && !validatePhone(formData.phone)) {
            setSuccessDialog({
                isOpen: true,
                message: 'Phone number must be exactly 10 digits!',
                isError: true,
                onClose: () => setSuccessDialog({ isOpen: false, message: '', isError: false, onClose: null }),
            });
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/patient/update-profile`,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    location: formData.location,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                const updatedUser = response.data.updatedUser;
                setFormData(updatedUser);
                onProfileUpdate(updatedUser);
                navigate('/dashboard/user?tab=about');
                setSuccessDialog({
                    isOpen: true,
                    message: 'Profile updated successfully!',
                    onClose: () => setSuccessDialog({ isOpen: false, message: '', onClose: null }),
                });
            } else {
                setSuccessDialog({
                    isOpen: true,
                    message: response.data.message || 'Failed to update profile',
                    isError: true,
                    onClose: () => setSuccessDialog({ isOpen: false, message: '', isError: false, onClose: null }),
                });
            }
        } catch (error) {
            console.error('Error while updating profile:', error);
            setSuccessDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error updating profile',
                isError: true,
                onClose: () => setSuccessDialog({ isOpen: false, message: '', isError: false, onClose: null }),
            });
        }
    };

    if (!auth?.token) {
        console.log("Rendering loading state due to missing token.");
        return <p>Loading profile...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
            <h1 className="text-2xl font-semibold text-navy/90 mb-6">Edit Profile</h1>
            <div className="space-y-6">
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your email"
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
                            placeholder="Enter your phone (10 digits)"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-navy/60 transition duration-200"
                            placeholder="Enter your address"
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