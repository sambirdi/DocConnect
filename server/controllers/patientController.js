const reviewModel = require('../models/reviews');
const userModel = require('../models/User');
const mongoose = require('mongoose');
require("dotenv").config();

// Submit a review for a doctor
exports.submitDocReviewController = async (req, res) => {
  try {
    const { doctorId, rating, reviewText } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !rating) {
      return res.status(400).json({ success: false, message: "Doctor ID and rating are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if doctor exists
    const doctor = await userModel.findOne({ _id: doctorId, role: 'doctor', isApproved: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found or not approved" });
    }

    // Check if patient exists
    const patient = await userModel.findOne({ _id: patientId, role: 'patient' });
    if (!patient) {
      return res.status(403).json({ success: false, message: "Invalid patient" });
    }

    // Check if patient has already reviewed this doctor
    const existingReview = await reviewModel.findOne({ doctorId, patientId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this doctor" });
    }

    // Create review
    const review = new reviewModel({ doctorId, patientId, rating, reviewText });
    await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ success: false, message: "Error submitting review", error: error.message });
  }
};

// Get all reviews for a doctor
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
      .populate('patientId', 'name')
      .select('rating reviewText createdAt');

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) 
      : 0;

    // Include patientId in the response
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      patientId: review.patientId._id.toString(), // Convert ObjectId to string for easier comparison
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
    res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
  }
};

// Update Review
exports.updateReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const patientId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const review = await reviewModel.findOne({ _id: reviewId, patientId });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
    }

    // Update review
    review.rating = rating ?? review.rating;
    review.reviewText = reviewText ?? review.reviewText;
    await review.save();

    res.status(200).json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Error updating review", error: error.message });
  }
};

// Delete Review
exports.deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const patientId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const review = await reviewModel.findOne({ _id: reviewId, patientId });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
    }

    await reviewModel.deleteOne({ _id: reviewId });

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review", error: error.message });
  }
};