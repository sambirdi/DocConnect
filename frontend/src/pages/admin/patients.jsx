import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { useAuth } from '../../context/auth';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
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

    const fetchPatients = async () => {
        try {
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

    useEffect(() => {
        if (auth.token) {
            fetchPatients();
            // Set up polling every 30 seconds
            const interval = setInterval(fetchPatients, 30000);
            return () => clearInterval(interval);
        }
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

    await fetchPatients(); // Re-fetch all patients to ensure the state is fully updated

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
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <FaUser className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">Patients</h1>
                                    <p className="text-sm text-gray-500 mt-1">Manage and review all registered patients</p>
                                </div>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-full">
                                <span className="text-sm font-medium text-green-600">
                                    {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <FaUser className="mb-4 h-10 w-10 text-green-300" />
                                Loading patients...
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-red-500">
                                <FaUser className="mb-4 h-10 w-10 text-red-300" />
                                {error}
                            </div>
                        ) : patients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <FaUser className="mb-4 h-10 w-10 text-green-300" />
                                No patients found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-y bg-gray-50">
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient) => (
                                            <tr key={patient._id} className="border-b hover:bg-green-50/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-gray-900">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.location || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{patient.phone || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${patient.isActive === false
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'}`}>
                                                        {patient.isActive === false ? 'Inactive' : 'Active'}
                                                    </span>
                                                </td>
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