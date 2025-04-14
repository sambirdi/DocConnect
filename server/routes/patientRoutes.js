const express = require('express');
const { submitDocReviewController, getDoctorReviewsController, editDocReviewController, deleteDocReviewController } = require('../controllers/patientController'); // Assuming controllers are in a separate file
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Submit a review for a doctor (Patient only)
router.post('/reviews', authenticate, submitDocReviewController);
// Get reviews for a specific doctor (Publicly accessible)
router.get('/doc-reviews/:doctorId', getDoctorReviewsController);
// Edit a review (Patient only)
router.put('/edit-reviews', authenticate, editDocReviewController);
// Delete a review (Patient only)
router.delete('/reviews/:reviewId', authenticate, deleteDocReviewController);

module.exports = router;