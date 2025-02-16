const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who will see this notification
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Doctor being approved/rejected
});

// Create a method to populate the notification with necessary user info
notificationSchema.methods.populateUserInfo = function() {
  return this.populate([
    { path: 'adminId', select: 'name email phone' },
    { path: 'doctorId', select: 'name email phone licenseNo' }
  ]);
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;