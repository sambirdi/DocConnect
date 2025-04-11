const express = require('express');
const { adminApproveRejectDoctor , 
    getNotifications, 
    markNotificationAsRead, users, getRecentUsers, addSeniorDoctor, getAllUsers } = require('../controllers/adminController');  // Destructure the function correctly
const { authenticateAdmin } = require('../middleware/authMiddleware');  // Ensure this is the correct path

const router = express.Router();

// Admin Routes with authentication
router.post('/approve-reject', authenticateAdmin, adminApproveRejectDoctor);// Route to get all notifications for the admin
router.get('/notifications', authenticateAdmin, getNotifications);

// Route to mark a specific notification as read
router.patch('/notifications/:id', authenticateAdmin, markNotificationAsRead);
router.get('/all-users/:id', authenticateAdmin, users);

router.get('/recent-users', authenticateAdmin, getRecentUsers);
router.get('/all-users', authenticateAdmin, getAllUsers);

router.post('/add-senior-doctor', authenticateAdmin, addSeniorDoctor);

module.exports = router;
