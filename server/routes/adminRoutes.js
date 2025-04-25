const express = require('express');
const { adminApproveRejectDoctor , 
    getNotifications, 
    markNotificationAsRead, 
    getUnreadNotificationCount,
    users, getRecentUsers, addSeniorDoctor, getAllUsers, deleteUser } = require('../controllers/adminController');  // Destructure the function correctly
const { authenticateAdmin } = require('../middleware/authMiddleware');  // Ensure this is the correct path
const formidable = require('express-formidable'); // for handling file uploads

const router = express.Router();

// Admin Routes with authentication
router.post('/approve-reject', authenticateAdmin, adminApproveRejectDoctor);// Route to get all notifications for the admin
router.get('/notifications', authenticateAdmin, getNotifications);

// Route to mark a specific notification as read
router.patch('/notifications/:id', authenticateAdmin, markNotificationAsRead);
router.get('/notifications/unread-count', authenticateAdmin, getUnreadNotificationCount);
router.get('/all-users/:id', authenticateAdmin, users);

router.get('/recent-users', authenticateAdmin, getRecentUsers);
router.get('/all-users', authenticateAdmin, getAllUsers);
router.delete('/users/:userId', authenticateAdmin, deleteUser);

router.post('/add-senior-doctor', authenticateAdmin, formidable(),addSeniorDoctor);

module.exports = router;
