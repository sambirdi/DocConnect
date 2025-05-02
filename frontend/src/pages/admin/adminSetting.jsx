import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaFlag } from 'react-icons/fa';
import AdminHeader from '../../components/header/adminHeader';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';

const AdminSettings = () => {
    const settingCards = [
        {
            title: "Add Senior Doctor",
            description: "Register a new senior doctor with auto-approved status.",
            icon: <FaUserPlus className="w-5 h-5" />,
            link: "/dashboard/add-Senior",
            color: "bg-blue-500"
        },
        {
            title: "Flagged Reviews",
            description: "Review and manage flagged content and user reports.",
            icon: <FaFlag className="w-5 h-5" />,
            link: "/dashboard/settings/flagged-reviews",
            color: "bg-red-500"
        }
    ];

    return (
        <div className="flex">
            <div className="fixed inset-y-0 left-0">
                <SidebarAdmin />
            </div>
            <div className="flex-1 ml-[250px]">
                <AdminHeader />
                <main className="p-8 bg-[#f3f4f6] min-h-screen">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-navy">Admin Settings</h1>
                        <p className="text-gray-600 text-sm mt-2">
                            Manage your system preferences and administrative actions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        {settingCards.map((card, index) => (
                            <Link
                                key={index}
                                to={card.link}
                                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-opacity-100 to-opacity-50" style={{ backgroundColor: card.color === 'bg-blue-500' ? '#3b82f6' : '#ef4444' }} />
                                <div className="p-6 pl-8">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card.color} bg-opacity-10 mb-4 group-hover:bg-opacity-20 transition-colors duration-300`}>
                                        <div className={`${card.color.replace('bg-', 'text-')}`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-navy transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {card.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSettings;