import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell } from "react-icons/fa";

const AdminHeader = () => {
    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="flex justify-between items-center max-w-7xl mx-auto p-2">
                    <div className="flex items-center gap-4 ml-auto">
                        <NavLink to="/dashboard/notification">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <FaBell className="h-5 w-5 text-gray-600" />
                            </button>
                        </NavLink>
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