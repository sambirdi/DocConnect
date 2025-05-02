const express = require('express');
const {
    flagReview,
    getAllFlaggedReviews,
    updateFlaggedReviewStatus,
    editFlaggedReview,
    getFlaggedReviewNotifications,
    markFlaggedReviewNotificationAsRead,
    getUnreadFlaggedReviewNotificationCount
} = require('../controllers/flaggedReviewController');
const { authenticate, authenticateAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Flag a review (Any authenticated user)
router.post('/flag/:doctorId', authenticate, flagReview);

// Get all flagged reviews (Admin only)
router.get('/flagged', authenticateAdmin, getAllFlaggedReviews);

// Update flagged review status (Admin only)
router.put('/:flagId', authenticateAdmin, updateFlaggedReviewStatus);

// Edit flagged review content (Admin only)
router.put('/flagged/:flagId/edit', authenticateAdmin, editFlaggedReview);

// Get flagged review notifications (Admin only)
router.get('/notifications', authenticateAdmin, getFlaggedReviewNotifications);

// Mark flagged review notification as read (Admin only)
router.put('/notifications/:id/read', authenticateAdmin, markFlaggedReviewNotificationAsRead);

// Get unread flagged review notification count (Admin only)
router.get('/notifications/unread/count', authenticateAdmin, getUnreadFlaggedReviewNotificationCount);

module.exports = router;