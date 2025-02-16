const express = require('express');
const { register,login, docRegister, forgotPassword, resetPassword , userInfo} = require('../controllers/authController');
const {assignDoctorRole, authenticate} = require('../middleware/authMiddleware');

const router = express.Router();

// POST route for user 
router.post('/register', register);
router.post('/docregister', assignDoctorRole, docRegister);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/user-info',authenticate,userInfo); // Protect user info route


module.exports = router;