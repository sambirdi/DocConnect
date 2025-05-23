const express = require('express');
const { submitDocReviewController, getDoctorReviewsController, editDocReviewController, deleteDocReviewController, activatePatientAccount, deactivatePatientAccount, updatePatientProfile } = require('../controllers/patientController'); // Assuming controllers are in a separate file
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
router.put('/update-profile', authenticate, updatePatientProfile);
// Account activation/deactivation routes
router.put('/account/activate', authenticate, activatePatientAccount);
router.put('/account/deactivate', authenticate, deactivatePatientAccount);

module.exports = router;