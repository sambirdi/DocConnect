import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { useAuth } from '../../context/auth';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/admin/recent-users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch patients');

                const data = await response.json();
                setPatients(data.recentPatients || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (auth.token) fetchPatients();
    }, [auth.token]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <SidebarAdmin />
            <main className="flex-1">
                <AdminHeader />
                <div className="p-5">
                    <h1 className="text-4xl font-bold mb-6">Patients</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {loading ? (
                            <div className="text-center text-gray-500">Loading patients...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-y">
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient) => (
                                            <tr key={patient._id} className="border-b">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={patient.photo?.data ? 
                                                                `data:${patient.photo.contentType};base64,${Buffer.from(patient.photo.data).toString('base64')}` 
                                                                : "https://via.placeholder.com/32"}
                                                            alt={patient.name}
                                                            className="h-8 w-8 rounded-full"
                                                        />
                                                        <span className="font-medium text-gray-900">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.location || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.phone || 'N/A'}</td>
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

export default Patients;