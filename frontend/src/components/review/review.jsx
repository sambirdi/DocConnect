import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, doctorId, onReviewSubmitted, review, isEditMode = false }) => {
    const [rating, setRating] = useState(0); // Always start with 0 for new reviews
    const [comment, setComment] = useState(''); // Always start empty for new reviews
    const [auth] = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Sync state with review data when in edit mode or reset for new review
    useEffect(() => {
        if (isEditMode && review) {
            setRating(review.rating || 0);
            setComment(review.reviewText || '');
        } else {
            setRating(0);
            setComment('');
        }
        setError(null); // Clear errors when modal opens
    }, [isEditMode, review, isOpen]);

    const handleRatingChange = (rate) => {
        setRating(rate);
        setError(null);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!auth.token) {
            setError('Please log in to submit a review.');
            return;
        }

        if (!rating) {
            setError('Please select a rating.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                const response = await axios.put(
                    'http://localhost:5000/api/patient/edit-reviews',
                    {
                        reviewId: review._id,
                        rating,
                        reviewText: comment,
                    },
                    {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    }
                );

                if (response.data.success) {
                    onReviewSubmitted({
                        _id: review._id,
                        rating,
                        reviewText: comment,
                        patientName: auth.user?.name || 'Current User',
                        createdAt: review.createdAt,
                    });
                    onClose();
                }
            } else {
                const response = await axios.post(
                    'http://localhost:5000/api/patient/reviews',
                    {
                        doctorId,
                        rating,
                        reviewText: comment,
                    },
                    {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    }
                );

                if (response.data.success) {
                    const newReview = {
                        _id: response.data.review?._id || Date.now(), // Fallback ID if backend doesn't provide one
                        rating,
                        reviewText: comment,
                        patientName: auth.user?.name || 'Current User',
                        createdAt: new Date().toISOString(),
                    };
                    onReviewSubmitted(newReview);
                    onClose();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || (isEditMode ? 'Failed to update review.' : 'Failed to submit review.'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-navy mb-4">
                    {isEditMode ? 'Edit Your Review' : 'Write a Review'}
                </h2>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            className={`text-2xl cursor-pointer ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => handleRatingChange(index + 1)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                    rows="4"
                    placeholder={isEditMode ? 'Edit your comment...' : 'Write your comment...'}
                    value={comment}
                    onChange={handleCommentChange}
                    maxLength="500"
                />

                <div className="text-sm text-gray-500 mt-1 mb-4">
                    {comment.length}/500 characters
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleSubmit}
                        className={`bg-navy text-white px-6 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-navy/80'}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : isEditMode ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                        onClick={onClose}
                        className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;