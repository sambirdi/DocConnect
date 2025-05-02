const mongoose = require('mongoose');

const flaggedReviewNotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    flaggedReviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlaggedReview', required: true }
});

flaggedReviewNotificationSchema.methods.populateUserInfo = function () {
    return this.populate([
        { path: 'adminId', select: 'name email' },
        { path: 'doctorId', select: 'name email' },
        { path: 'patientId', select: 'name email' },
        { path: 'reviewId', select: 'rating reviewText' },
        { path: 'flaggedReviewId', select: 'reason status adminNotes' }
    ]);
};

// Create indexes for performance
flaggedReviewNotificationSchema.index({ adminId: 1, read: 1, createdAt: -1 });

const FlaggedReviewNotification = mongoose.model('FlaggedReviewNotification', flaggedReviewNotificationSchema);

module.exports = FlaggedReviewNotification;