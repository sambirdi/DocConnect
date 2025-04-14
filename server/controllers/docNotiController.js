const notificationModel = require('../models/docNotification');
const userModel = require('../models/User');
const mongoose = require('mongoose');

// Create a notification for a doctor when a review is submitted
exports.createNotification = async (doctorId, patientId, reviewId) => {
    try {
      const patient = await userModel.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
  
      const message = `New review received from ${patient.name}`;
      
      const notification = new notificationModel({
        doctorId,
        patientId,
        reviewId,
        message,
      });
  
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };
  
  // Get notifications for a doctor
  exports.getDoctorNotificationsController = async (req, res) => {
    try {
      const doctorId = req.user.id;
  
      const notifications = await notificationModel
        .find({ doctorId })
        .populate('patientId', 'name')
        .populate('reviewId', 'rating reviewText')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications',
        error: error.message,
      });
    }
  };
  
  // Mark notification as read
  exports.markNotificationAsReadController = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const doctorId = req.user.id;
  
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({ success: false, message: 'Invalid notification ID' });
      }
  
      const notification = await notificationModel.findOne({ _id: notificationId, doctorId });
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found or you are not authorized' });
      }
  
      notification.isRead = true;
      await notification.save();
  
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        notification,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: error.message,
      });
    }
  };