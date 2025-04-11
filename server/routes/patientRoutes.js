const express = require('express');
const { submitDocReviewController, getDoctorReviewsController, updateReviewController, deleteReviewController } = require('../controllers/patientController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit a review for a doctor (Patient only)
router.post('/reviews', authenticate, submitDocReviewController);
// Get reviews for a specific doctor (Publicly accessible)
router.get('/doc-reviews/:doctorId', getDoctorReviewsController);

// Update a review (Patient only)
router.put('/reviews/:reviewId', authenticate, updateReviewController);

// Delete a review (Patient only)
router.delete('/reviews/:reviewId', authenticate, deleteReviewController);

module.exports = router;