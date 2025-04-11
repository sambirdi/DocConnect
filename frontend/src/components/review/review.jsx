import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, doctorId, reviewToEdit, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [auth] = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.reviewText || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [reviewToEdit]);

  const handleRatingChange = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (!auth?.token) {
      setError('Please log in to submit or edit a review.');
      return;
    }
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (reviewToEdit) {
        // Edit Review API
        response = await axios.put(
          `http://localhost:5000/api/patient/reviews/${reviewToEdit.id}`,
          { rating, reviewText: comment },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
      } else {
        // Create Review API
        response = await axios.post(
          `http://localhost:5000/api/patient/reviews`,
          { doctorId, rating, reviewText: comment },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
      }

      if (response.data.success) {
        onReviewSubmitted(response.data.review, reviewToEdit ? 'update' : 'add');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-navy mb-4">
          {reviewToEdit ? 'Edit Review' : 'Write a Review'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className={`bg-navy text-white px-6 py-2 rounded-md mr-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : reviewToEdit ? 'Update Review' : 'Submit Review'}
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;