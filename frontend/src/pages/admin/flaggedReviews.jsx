import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaFlag, FaCheck, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/auth';

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

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Flagged Reviews</h1>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : flaggedReviews.length === 0 ? (
                <div className="text-center text-gray-500">No flagged reviews found</div>
            ) : (
                <div className="grid gap-6">
                    {flaggedReviews.map((flagged) => {
                        console.log('Rendering review:', {
                            id: flagged._id,
                            status: flagged.status,
                            className: `bg-white rounded-lg shadow-md p-6 border ${
                                flagged.status === 'pending' ? 'border-red-500 bg-red-50' : 
                                flagged.status === 'safe' ? 'border-green-500 bg-green-50' : 
                                'border-gray-200'
                            }`
                        });
                        
                        return (
                            <div 
                                key={flagged._id} 
                                className={`bg-white rounded-lg shadow-md p-6 border ${
                                    flagged.status === 'pending' ? 'border-red-500 bg-red-50' : 
                                    flagged.status === 'safe' ? 'border-green-500 bg-green-50' : 
                                    'border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
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
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            {flagged.reviewId ? (
                                                <>
                                                    <div className="flex items-center mb-2">
                                                        {[...Array(flagged.reviewId.rating || 0)].map((_, i) => (
                                                            <span key={i} className="text-yellow-400">★</span>
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{flagged.reviewId.reviewText}</p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 italic">Review content not available</p>
                                            )}
                                            <div className="text-sm text-gray-500">
                                                <p>Doctor: {flagged.doctorId?.name || 'Unknown Doctor'}</p>
                                                <p>Patient: {flagged.patientId?.name || 'Unknown Patient'}</p>
                                                <p>Reason for flag: {flagged.reason}</p>
                                                <p>Date: {new Date(flagged.createdAt).toLocaleDateString()}</p>
                                                <p>Current Status: {flagged.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {flagged.status === 'pending' && (
                                        <div className="flex gap-2">
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FlaggedReviews; 