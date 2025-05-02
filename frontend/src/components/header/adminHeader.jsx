import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBell } from "react-icons/fa";
import axios from 'axios';
import { useAuth } from '../../context/auth';

const AdminHeader = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [auth] = useAuth();
    const navigate = useNavigate();

    // Fetch unread notifications count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!auth?.token) return;

            try {
                const response = await axios.get('http://localhost:5000/api/admin/notifications/unread-count', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });

                if (response.data.unreadCount !== undefined) {
                    setUnreadCount(response.data.unreadCount);
                }
            } catch (error) {
                console.error('Error fetching unread notification count:', error);
            }
        };

        fetchUnreadCount();
        // Set up polling to refresh count every 10 seconds instead of 30
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
    }, [auth?.token]);

    const handleNotificationClick = () => {
        navigate('/dashboard/notification');
    };

    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="flex justify-between items-center max-w-7xl mx-auto p-2">
                    <div className="flex items-center gap-4 ml-auto">
                        <button 
                            onClick={handleNotificationClick}
                            className="relative p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FaBell className="h-5 w-5 text-gray-600" />
                            
                            {unreadCount > 0 && (
                                <span className="unread-count absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-3 p-2">
                            <img src="https://i.pinimg.com/1200x/60/31/25/6031253da1d85e65d4e3d1ba0cff44b4.jpg" alt="Avatar" className="h-6 w-6 rounded-full" />
                            <span className="text-gray-700">Sambirdi Bam</span>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default AdminHeader;
