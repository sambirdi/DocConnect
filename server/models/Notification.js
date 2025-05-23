const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who will see this notification
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Doctor being approved/rejected
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Patient who registered
  type: { 
    type: String, 
    enum: ['doctor_registration', 'patient_registration', 'flagged_review', 'account_approval'], // Added account_approval
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' // Default for doctor_registration notifications
  }
});

// Create a method to populate the notification with necessary user info
notificationSchema.methods.populateUserInfo = function() {
  return this.populate([
    { path: 'adminId', select: 'name email phone' },
    { path: 'doctorId', select: 'name email phone licenseNo' },
    { path: 'patientId', select: 'name email phone' }
  ]);
};

// Index for efficient querying by type, status, and creation time
notificationSchema.index({ type: 1, status: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;