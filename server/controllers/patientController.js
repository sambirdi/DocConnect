const reviewModel = require('../models/reviews');
const userModel = require('../models/User');
const mongoose = require('mongoose');
const { createNotification } = require('./docNotiController');
require("dotenv").config();

// Submit a review for a doctor
exports.submitDocReviewController = async (req, res) => {
  try {
    const { doctorId, rating, reviewText } = req.body;
    const patientId = req.user.id;

    // Validate input
    if (!doctorId || !rating) {
      return res.status(400).json({ success: false, message: "Doctor ID and rating are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if doctor exists and is approved
    const doctor = await userModel.findOne({ _id: doctorId, role: 'doctor', isApproved: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found or not approved" });
    }

    // Check if patient exists
    const patient = await userModel.findOne({ _id: patientId, role: 'patient' });
    if (!patient) {
      return res.status(403).json({ success: false, message: "Invalid patient" });
    }

    // Create new review
    const review = new reviewModel({
      doctorId,
      patientId,
      rating,
      reviewText,
    });

    await review.save();

    // Create notification for the doctor
    await createNotification(doctorId, patientId, review._id);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting review",
      error: error.message,
    });
  }
};


// Get reviews for a doctor
exports.getDoctorReviewsController = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }

    const doctor = await userModel.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const reviews = await reviewModel
      .find({ doctorId })
      .populate('patientId', 'name') // Populate patient name
      .select('rating reviewText createdAt _id')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;

    // Map reviews, handling null patientId
    const formattedReviews = reviews
      .filter(review => review.patientId) // Skip reviews with null patientId
      .map(review => ({
        _id: review._id,
        patientName: review.patientId.name,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
      }));

    res.status(200).json({
      success: true,
      averageRating,
      totalReviews,
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// Edit a review
exports.editDocReviewController = async (req, res) => {
  try {
    const { reviewId, rating, reviewText } = req.body;
    const patientId = req.user.id;

    // Validate input
    if (!reviewId || !rating) {
      return res.status(400).json({ success: false, message: "Review ID and rating are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if review exists and belongs to the patient
    const review = await reviewModel.findOne({ _id: reviewId, patientId });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or you are not authorized to edit it" });
    }

    // Update review
    review.rating = rating;
    review.reviewText = reviewText || review.reviewText; // Keep existing text if not provided
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({
      success: false,
      message: "Error editing review",
      error: error.message,
    });
  }
};

// Delete a review
exports.deleteDocReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const patientId = req.user.id;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    // Check if review exists and belongs to the patient
    const review = await reviewModel.findOne({ _id: reviewId, patientId });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or you are not authorized to delete it" });
    }

    // Delete review
    await reviewModel.deleteOne({ _id: reviewId });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
// Activate own patient account
exports.activatePatientAccount = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticated user

    // Find the patient (only the authenticated user with role: "patient")
    const patient = await userModel.findOne({ _id: userId, role: "patient" });
    if (!patient) {
      return res.status(403).json({ success: false, message: "Not authorized. Patient account required." });
    }

    // Check if already active
    if (patient.isActive) {
      return res.status(400).json({ success: false, message: "Your account is already active" });
    }

    // Activate the account
    patient.isActive = true;
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Your account has been activated successfully",
    });
  } catch (error) {
    console.error("Error activating patient account:", error);
    res.status(500).json({
      success: false,
      message: "Error activating your account",
      error: error.message,
    });
  }
};

// Deactivate own patient account
exports.deactivatePatientAccount = async (req, res) => {
  try {
    console.log("req.user in deactivatePatientAccount:", req.user); // Debug log
    const userId = req.user.id; // From authenticated user

    // Find the patient (only the authenticated user with role: "patient")
    const patient = await userModel.findOne({ _id: userId, role: "patient" });
    if (!patient) {
      return res.status(403).json({ success: false, message: "Not authorized. Patient account required." });
    }

    // Check if already deactivated
    if (!patient.isActive) {
      return res.status(400).json({ success: false, message: "Your account is already deactivated" });
    }

    // Deactivate the account
    patient.isActive = false;
    await patient.save();

    // Instruct frontend to log out
    res.status(200).json({
      success: true,
      message: "Your account has been deactivated successfully. Please log out.",
      logout: true, // Signal to frontend to clear auth and redirect
    });
  } catch (error) {
    console.error("Error deactivating patient account:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating your account",
      error: error.message,
    });
  }
};
// In patientController.js
exports.updatePatientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, location } = req.body;

        const patient = await userModel.findOne({ _id: userId, role: "patient" });
        if (!patient) {
            return res.status(403).json({ success: false, message: "Not authorized. Patient account required." });
        }

        if (email && email !== patient.email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email is already in use by another account." });
            }
        }

        if (name) patient.name = name;
        if (email) patient.email = email;
        if (phone) patient.phone = phone;
        if (location) patient.location = location;

        await patient.save();

        const updatedUser = {
            _id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            location: patient.location,
            role: patient.role,
            isActive: patient.isActive,
        };

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUser,
        });
    } catch (error) {
        console.error("Error updating patient profile:", error);
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({
                success: false,
                message: message || "Validation error",
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
};