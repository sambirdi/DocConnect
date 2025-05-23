import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaFlag, FaCheck, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/auth';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import AdminHeader from '../../components/header/adminHeader';

const FlaggedReviews = () => {
    const [flaggedReviews, setFlaggedReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();

    useEffect(() => {
        fetchFlaggedReviews();
    }, []);

    const fetchFlaggedReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reviews/flagged', {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            console.log('Fetched reviews:', response.data);
            setFlaggedReviews(response.data.flaggedReviews);
        } catch (error) {
            console.error('Error fetching flagged reviews:', error);
            toast.error(error.response?.data?.message || 'Failed to load flagged reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (flaggedReview, action) => {
        try {
            if (!flaggedReview._id) {
                toast.error('Invalid review ID');
                return;
            }

            console.log('Making API call with:', {
                flaggedReviewId: flaggedReview._id,
                action,
                currentStatus: flaggedReview.status
            });

            const response = await axios.put(
                `http://localhost:5000/api/reviews/${flaggedReview._id}`,
                {
                    status: action,
                    adminNotes: `Marked as ${action} by admin`
                },
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );

            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success(`Review marked as ${action} successfully`);
                await fetchFlaggedReviews();
            }
        } catch (error) {
            console.error('Error updating review status:', error);
            toast.error(error.response?.data?.message || 'Failed to update review status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <SidebarAdmin />
            <main className="flex-1 ml-64">
                <AdminHeader />
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">Flagged Reviews</h1>
                                    <p className="text-sm text-gray-500 mt-1">Manage and review reported content</p>
                                </div>
                            </div>
                            <div className="bg-red-50 px-4 py-2 rounded-full">
                                <span className="text-sm font-medium text-red-600">
                                    {flaggedReviews.length} {flaggedReviews.length === 1 ? 'Review' : 'Reviews'} Flagged
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading...</div>
                        </div>
                    ) : flaggedReviews.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <FaFlag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flagged Reviews</h3>
                            <p className="text-gray-500">There are currently no reviews that need attention.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {flaggedReviews.map((flagged) => (
                                <div 
                                    key={flagged._id} 
                                    className={`bg-white rounded-lg shadow-sm p-6 border ${
                                        flagged.status === 'pending' ? 'border-red-500 bg-red-50' : 
                                        flagged.status === 'safe' ? 'border-green-500 bg-green-50' : 
                                        'border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-4">
                                                <FaFlag className={`${
                                                    flagged.status === 'pending' ? 'text-red-500' : 
                                                    flagged.status === 'safe' ? 'text-green-500' : 
                                                    'text-gray-500'
                                                }`} />
                                                <span className="font-semibold text-gray-700">
                                                    {flagged.status === 'pending' ? 'Reported Review' : 
                                                     flagged.status === 'safe' ? 'Safe Review' : 
                                                     'Resolved Review'}
                                                </span>
                                            </div>
                                            <div className="bg-white p-4 rounded-md border border-gray-100">
                                                {flagged.reviewId ? (
                                                    <>
                                                        <div className="flex items-center mb-2">
                                                            {[...Array(flagged.reviewId.rating || 0)].map((_, i) => (
                                                                <span key={i} className="text-yellow-400">★</span>
                                                            ))}
                                                        </div>
                                                        <p className="text-gray-700 mb-4">{flagged.reviewId.reviewText}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500 italic">Review content not available</p>
                                                )}
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                                    <div>
                                                        <p className="font-medium">Doctor</p>
                                                        <p>{flagged.doctorId?.name || 'Unknown Doctor'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Patient</p>
                                                        <p>{flagged.patientId?.name || 'Unknown Patient'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Reason for Flag</p>
                                                        <p>{flagged.reason}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Date</p>
                                                        <p>{new Date(flagged.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {flagged.status === 'pending' && (
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleAction(flagged, 'safe')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                                                    title="Mark as Safe"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(flagged, 'resolved')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                    title="Delete Review"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FlaggedReviews; 