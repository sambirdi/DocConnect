import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';
import { useAuth } from '../../context/auth';
import { FaEdit, FaTrash, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auth] = useAuth();
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, doctorId: null, doctorName: '' });
    const [editDialog, setEditDialog] = useState({ isOpen: false, doctor: null });
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        practice: '',
        location: '',
        licenseNo: '',
        isApproved: false,
        isActive: true
    });

    const fetchDoctors = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/all-users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch doctors');

            const data = await response.json();
            const processedDoctors = data.recentDoctors.map(doctor => ({
                ...doctor,
                isActive: doctor.isActive
            }));
            
            setDoctors(processedDoctors || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.token) {
            fetchDoctors();
            // Set up polling every 30 seconds
            const interval = setInterval(fetchDoctors, 30000);
            return () => clearInterval(interval);
        }
    }, [auth.token]);

    const handleDelete = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${doctorId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to delete doctor');

            const data = await response.json();
            toast.success(data.message);
            setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
            setDeleteDialog({ isOpen: false, doctorId: null, doctorName: '' });
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleEdit = (doctor) => {
        console.log('Editing doctor:', doctor);
        setEditDialog({ isOpen: true, doctor });
        setEditFormData({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone || '',
            practice: doctor.practice || '',
            location: doctor.location || '',
            licenseNo: doctor.licenseNo || '',
            isApproved: doctor.isApproved,
            isActive: doctor.isActive
        });
    };

    const handleCancelEdit = () => {
        setEditDialog({ isOpen: false, doctor: null });
        setEditFormData({
            name: '',
            email: '',
            phone: '',
            practice: '',
            location: '',
            licenseNo: '',
            isApproved: false,
            isActive: true
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/update-user/${editDialog.doctor._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) throw new Error('Failed to update doctor');

            const data = await response.json();
            toast.success(data.message);
            
            // Update the doctors list with the new data
            setDoctors(doctors.map(doctor => 
                doctor._id === editDialog.doctor._id ? { ...doctor, ...editFormData } : doctor
            ));
            
            setEditDialog({ isOpen: false, doctor: null });
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <SidebarAdmin />
            <main className="flex-1 ml-64">
                <AdminHeader />
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <FaUserMd className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
                                    <p className="text-sm text-gray-500 mt-1">Manage and review all registered doctors</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 px-4 py-2 rounded-full">
                                <span className="text-sm font-medium text-blue-600">
                                    {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <FaUserMd className="mb-4 h-10 w-10 text-blue-300" />
                                Loading doctors...
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-red-500">
                                <FaUserMd className="mb-4 h-10 w-10 text-red-300" />
                                {error}
                            </div>
                        ) : doctors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                <FaUserMd className="mb-4 h-10 w-10 text-blue-300" />
                                No doctors found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-y bg-gray-50">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Specialist</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Account</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.map((doctor) => (
                                            <tr key={doctor._id} className="border-b hover:bg-blue-50/40 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                                                            {doctor.photo ? (
                                                                <img
                                                                    src={`data:${doctor.photo.contentType};base64,${doctor.photo.data}`}
                                                                    alt={doctor.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg">
                                                                    {doctor.name?.charAt(0) || "D"}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{doctor.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-gray-600 text-sm">{doctor.email}</td>
                                                <td className="px-4 py-4 text-gray-600 text-sm">{doctor.practice || 'N/A'}</td>
                                                <td className="px-4 py-4 text-gray-600 text-sm">{doctor.location || 'N/A'}</td>
                                                <td className="px-4 py-4 text-gray-600 text-sm">{doctor.phone || 'N/A'}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${doctor.isApproved ?
                                                        'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {doctor.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${doctor.isActive === false ?
                                                        'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {doctor.isActive === false ? 'Inactive' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleEdit(doctor)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteDialog({ isOpen: true, doctorId: doctor._id, doctorName: doctor.name })}
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
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                            <p className="mb-6">Are you sure you want to delete {deleteDialog.doctorName}? This action cannot be undone.</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setDeleteDialog({ isOpen: false, doctorId: null, doctorName: '' })}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteDialog.doctorId)}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Doctor Dialog */}
                {editDialog.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Edit Doctor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Practice</label>
                                    <input
                                        type="text"
                                        name="practice"
                                        value={editFormData.practice}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License No</label>
                                    <input
                                        type="text"
                                        name="licenseNo"
                                        value={editFormData.licenseNo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isApproved"
                                            checked={editFormData.isApproved}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Approved</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={editFormData.isActive}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Active Account</span>
                                    </label>
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

export default Doctors;