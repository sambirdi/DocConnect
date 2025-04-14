import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { useAuth } from '../../context/auth';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/admin/all-users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch doctors');

                const data = await response.json();
                setDoctors(data.recentDoctors || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (auth.token) fetchDoctors();
    }, [auth.token]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <SidebarAdmin />
            <main className="flex-1 ml-64">
                <AdminHeader />
                <div className="p-5">
                    <h1 className="text-4xl font-bold mb-6">Doctors</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {loading ? (
                            <div className="text-center text-gray-500">Loading doctors...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-y">
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Specialist</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.map((doctor) => (
                                            <tr key={doctor._id} className="border-b">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 overflow-hidden mx-auto mt-4">
                                                                {doctor.photo ? (
                                                                    <img
                                                                        src={`data:${doctor.photo.contentType};base64,${doctor.photo.data}`}
                                                                        alt={doctor.name}
                                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg">
                                                                        {doctor.name?.charAt(0) || "D"}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="font-medium text-gray-900">{doctor.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{doctor.practice || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{doctor.location || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{doctor.phone || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${doctor.isApproved ?
                                                        'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {doctor.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Doctors;