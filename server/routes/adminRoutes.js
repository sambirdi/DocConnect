const express = require('express');
const {
  adminApproveRejectDoctor,
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  users,
  getRecentUsers,
  getAllUsers,
  deleteUser,
  addSeniorDoctor,
  updateUser,
  getAllNotifications,
  markFlaggedReviewNotificationAsRead
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const formidable = require('express-formidable'); // for handling file uploads

const router = express.Router();

// Approve or reject doctor
router.post('/approve-reject', authenticateAdmin, adminApproveRejectDoctor);

// Get doctor registration notifications
router.get('/notifications', authenticateAdmin, getNotifications);

// Get all notifications (doctor registrations and flagged reviews)
router.get('/all-notifications', authenticateAdmin, getAllNotifications);

// Mark doctor registration notification as read
router.put('/notifications/:id/read', authenticateAdmin, markNotificationAsRead);

// Mark flagged review notification as read
router.put('/flagged-notifications/:id/read', authenticateAdmin, markFlaggedReviewNotificationAsRead);

// Get unread notification count
router.get('/notifications/unread/count', authenticateAdmin, getUnreadNotificationCount);

// Get all users (excluding admins)
router.get('/users', authenticateAdmin, users);

// Get recent users
router.get('/recent-users', authenticateAdmin, getRecentUsers);

// Get all users (doctors and patients)
router.get('/all-users', authenticateAdmin, getAllUsers);

// Delete a user
router.delete('/users/:userId', authenticateAdmin, deleteUser);

// Add senior doctor
router.post('/senior-doctor', authenticateAdmin, formidable(), addSeniorDoctor);

// Update a user
router.put('/update-user/:userId', authenticateAdmin, updateUser);

module.exports = router;