import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ user, onProfileUpdate }) {
    const [formData, setFormData] = useState(user || {});
    const [auth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setFormData(user || {});
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
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
                onProfileUpdate(updatedUser);
                navigate('/dashboard/user?tab=about');
            } else {
                console.log('Error from server:', response.data.message);
            }
        } catch (error) {
            console.error('Error while updating profile:', error);
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
                            placeholder="Enter your phone"
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