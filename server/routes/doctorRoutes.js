const express = require('express');
const { updateDocProfileController,
    docPhotoController, getDoctorById,
    getDoctorsBySpecialty, getAllDoctors,
    changePassword, searchDoctor, activateDoctorAccount, deactivateDoctorAccount } = require('../controllers/doctorController');
const { authenticateAdmin, authenticate } = require('../middleware/authMiddleware');
const formidable = require('express-formidable'); // for handling file uploads

const router = express.Router();

// Middleware order: First parse the form data (file uploads, fields), then authenticate the user
router.put('/update-docprofile', formidable(), authenticate, updateDocProfileController);

// Endpoint to retrieve a user's photo by their userId
router.get("/doc-photo/:userId", docPhotoController);
router.get('/doc/:id', getDoctorById);
router.get('/doc-specialty', getDoctorsBySpecialty);
router.get('/all-doctors', getAllDoctors);

router.get("/search-doctor", searchDoctor);

router.put('/change-password', authenticate, changePassword); // Change password

// New routes for doctors to activate/deactivate their own accounts
router.put('/account/activate', authenticate, activateDoctorAccount);
router.put('/account/deactivate', authenticate, deactivateDoctorAccount);

module.exports = router;