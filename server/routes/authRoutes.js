const express = require('express');
const { register,login, docRegister, forgotPassword, resetPassword , userInfo, verifyOTP, resendOTP} = require('../controllers/authController');
const {assignDoctorRole, authenticate} = require('../middleware/authMiddleware');
const formidable = require('express-formidable'); // for handling file uploads

const router = express.Router();

// POST route for user 
router.post('/register', register);
// Endpoint to retrieve a doctor's certificate by their userId
// router.get("/doc-certificate/:userId", docPhotoController);
router.post('/docregister', formidable(), assignDoctorRole, docRegister);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/user-info',authenticate,userInfo); // Protect user info route

router.post('/verify-otp', verifyOTP); // New OTP verification route
router.post('/resend-otp', resendOTP); // New route to resend OTP


module.exports = router;