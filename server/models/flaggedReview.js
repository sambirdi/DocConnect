const mongoose = require('mongoose');

const flaggedReviewSchema = new mongoose.Schema({
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'safe', 'edited'],
        default: 'pending'
    },
    adminNotes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    }
});

// Add indexes for performance
flaggedReviewSchema.index({ doctorId: 1, reviewId: 1 });
flaggedReviewSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('FlaggedReview', flaggedReviewSchema);