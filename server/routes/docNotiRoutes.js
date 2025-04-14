const express = require('express');
const { getDoctorNotificationsController, markNotificationAsReadController } = require('../controllers/docNotiController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notifications for a doctor (Doctor only)
router.get('/notifications', authenticate, getDoctorNotificationsController);
// Mark a notification as read (Doctor only)
router.put('/notifications/:notificationId/read', authenticate, markNotificationAsReadController);

module.exports = router;