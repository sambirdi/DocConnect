const express = require('express');
const { updateDocProfileController, docPhotoController, getDoctorById, getDoctorsBySpecialty, searchDoctor } = require('../controllers/doctorController');  
const { assignDoctorRole, authenticate } = require('../middleware/authMiddleware'); 
const formidable = require('express-formidable'); // for handling file uploads

const router = express.Router();

// Middleware order: First parse the form data (file uploads, fields), then authenticate the user
router.put('/update-docprofile', formidable(), authenticate, updateDocProfileController);

// Endpoint to retrieve a user's photo by their userId
router.get("/doc-photo/:userId", docPhotoController);
router.get('/doc/:id', getDoctorById);
router.get('/doc-specialty', getDoctorsBySpecialty);
router.get("/search-doctor", searchDoctor);
module.exports = router;