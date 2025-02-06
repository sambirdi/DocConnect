const express = require('express');
const { register,login, docregister, forgotPassword, resetPassword } = require('../controllers/authController');
const {assignDoctorRole} = require('../middleware/authMiddleware');

const router = express.Router();

// POST route for user 
router.post('/register', register);
router.post('/docregister', assignDoctorRole, docregister);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;