import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { useAuth } from '../../context/auth';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth();
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, patientId: null, patientName: '' });
    const [editDialog, setEditDialog] = useState({ isOpen: false, patient: null });
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/admin/all-users', {
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

    const handleDelete = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to delete patient');

            const data = await response.json();
            toast.success(data.message);
            setPatients(patients.filter(patient => patient._id !== patientId));
            setDeleteDialog({ isOpen: false, patientId: null, patientName: '' });
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleEdit = (patient) => {
        setEditDialog({ isOpen: true, patient });
        setEditFormData({
            name: patient.name,
            email: patient.email,
            phone: patient.phone || '',
            location: patient.location || ''
        });
    };

    const handleCancelEdit = () => {
        setEditDialog({ isOpen: false, patient: null });
        setEditFormData({
            name: '',
            email: '',
            phone: '',
            location: ''
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/update-user/${editDialog.patient._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) throw new Error('Failed to update patient');

            const data = await response.json();
            toast.success(data.message);
            
            // Update the patients list with the new data
            setPatients(patients.map(patient => 
                patient._id === editDialog.patient._id ? { ...patient, ...editFormData } : patient
            ));
            
            setEditDialog({ isOpen: false, patient: null });
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <SidebarAdmin />
            <main className="flex-1 ml-64">
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
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient) => (
                                            <tr key={patient._id} className="border-b">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-gray-900">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.location || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.phone || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(patient)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteDialog({ isOpen: true, patientId: patient._id, patientName: patient.name })}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                {deleteDialog.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                            <p className="mb-6">Are you sure you want to delete {deleteDialog.patientName}? This action cannot be undone.</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setDeleteDialog({ isOpen: false, patientId: null, patientName: '' })}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteDialog.patientId)}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Patient Dialog */}
                {editDialog.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
                            <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Patients;