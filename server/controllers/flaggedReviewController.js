const FlaggedReview = require('../models/flaggedReview');
const Review = require('../models/reviews');
const FlaggedReviewNotification = require('../models/FlaggedReviewNotification');
const User = require('../models/User');
const mongoose = require('mongoose');

// Flag a review
exports.flagReview = async (req, res) => {
    try {
        const { reviewId, reason } = req.body;
        const doctorId = req.params.doctorId;

        // Check if review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if review is already flagged
        const existingFlag = await FlaggedReview.findOne({ reviewId });
        if (existingFlag) {
            return res.status(400).json({
                success: false,
                message: 'Review is already flagged'
            });
        }

        // Fetch doctor details to get the name
        const doctor = await User.findById(doctorId).select('name');
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Create new flagged review
        const flaggedReview = new FlaggedReview({
            reviewId,
            doctorId,
            patientId: review.patientId,
            reason
        });

        await flaggedReview.save();

        // Create notification for admin
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            const notification = new FlaggedReviewNotification({
                message: `A review for ${doctor.name} has been flagged for review.`,
                adminId: admin._id,
                doctorId,
                patientId: review.patientId,
                reviewId,
                flaggedReviewId: flaggedReview._id,
                read: false
            });
            await notification.save();
        }

        res.status(201).json({
            success: true,
            message: 'Review has been flagged for admin review',
            flaggedReview
        });
    } catch (error) {
        console.error('Error flagging review:', error);
        res.status(500).json({
            success: false,
            message: 'Error flagging review',
            error: error.message
        });
    }
};

// Get all flagged reviews (Admin only)
exports.getAllFlaggedReviews = async (req, res) => {
    try {
        const flaggedReviews = await FlaggedReview.find()
            .populate('reviewId', 'rating reviewText')
            .populate('doctorId', 'name email')
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            flaggedReviews
        });
    } catch (error) {
        console.error('Error fetching flagged reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching flagged reviews',
            error: error.message
        });
    }
};

// Update flagged review status (Admin only)
exports.updateFlaggedReviewStatus = async (req, res) => {
    try {
        const { flagId } = req.params;
        const { status, adminNotes } = req.body;

        const flaggedReview = await FlaggedReview.findById(flagId);
        if (!flaggedReview) {
            return res.status(404).json({
                success: false,
                message: 'Flagged review not found'
            });
        }

        // If marking as resolved, also delete the review
        if (status === 'resolved') {
            await Review.findByIdAndDelete(flaggedReview.reviewId);

            // Update related notification
            const notification = await FlaggedReviewNotification.findOne({
                flaggedReviewId: flaggedReview._id
            });
            if (notification) {
                notification.message = `Flagged review has been resolved and deleted.`;
                notification.read = true;
                await notification.save();
            }
        }

        flaggedReview.status = status;
        flaggedReview.adminNotes = adminNotes;
        flaggedReview.resolvedAt = Date.now();
        await flaggedReview.save();

        res.status(200).json({
            success: true,
            message: `Flagged review marked as ${status}`,
            flaggedReview
        });
    } catch (error) {
        console.error('Error updating flagged review:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating flagged review',
            error: error.message
        });
    }
};

// Edit flagged review content (Admin only)
exports.editFlaggedReview = async (req, res) => {
    try {
        const { flagId } = req.params;
        const { reviewText, reviewId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(flagId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid flagged review ID format'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID format'
            });
        }

        // Find the flagged review
        const flaggedReview = await FlaggedReview.findById(flagId);
        if (!flaggedReview) {
            return res.status(404).json({
                success: false,
                message: 'Flagged review not found'
            });
        }

        // Update the review content
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Original review not found'
            });
        }

        // Update the review
        review.reviewText = reviewText;
        await review.save();

        // Mark the flagged review as edited
        flaggedReview.status = 'edited';
        flaggedReview.adminNotes = 'Review content edited by admin';
        flaggedReview.resolvedAt = Date.now();
        await flaggedReview.save();

        // Update related notification
        const notification = await FlaggedReviewNotification.findOne({
            flaggedReviewId: flaggedReview._id
        });
        if (notification) {
            notification.message = `Flagged review has been edited by admin.`;
            notification.read = true;
            await notification.save();
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Review content updated successfully',
            flaggedReview: await FlaggedReview.findById(flagId)
                .populate('reviewId')
                .populate('doctorId')
                .populate('patientId')
        });
    } catch (error) {
        console.error('Error editing flagged review:', error);
        res.status(500).json({
            success: false,
            message: 'Error editing flagged review',
            error: error.message
        });
    }
};

// Get flagged review notifications (Admin only)
exports.getFlaggedReviewNotifications = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const notifications = await FlaggedReviewNotification.find({ adminId: req.user._id })
            .populate('doctorId', 'name email')
            .populate('patientId', 'name email')
            .populate('reviewId', 'rating reviewText')
            .populate('flaggedReviewId', 'reason status adminNotes')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await FlaggedReviewNotification.countDocuments({ adminId: req.user._id });

        res.status(200).json({
            success: true,
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching flagged review notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching flagged review notifications',
            error: error.message
        });
    }
};

// Mark flagged review notification as read (Admin only)
exports.markFlaggedReviewNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid notification ID' });
        }

        const notification = await FlaggedReviewNotification.findOne({ _id: id, adminId })
            .populate('doctorId', 'name email')
            .populate('patientId', 'name email')
            .populate('reviewId', 'rating reviewText')
            .populate('flaggedReviewId', 'reason status adminNotes');
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found or unauthorized' });
        }

        if (notification.read) {
            return res.status(400).json({ success: false, message: 'Notification already marked as read' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

// Get unread flagged review notification count (Admin only)
exports.getUnreadFlaggedReviewNotificationCount = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
        }

        const unreadCount = await FlaggedReviewNotification.countDocuments({
            adminId: req.user._id,
            read: false
        });

        res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread notification count',
            error: error.message
        });
    }
};