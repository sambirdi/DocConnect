const nodemailer = require('nodemailer');
const userModel = require('../models/User');
const Notification = require('../models/Notification');
const FlaggedReviewNotification = require('../models/FlaggedReviewNotification');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const mongoose = require('mongoose');

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

// Function to send email about account approval or rejection
const sendDoctorStatusEmail = async (email, status) => {
  const link = `http://localhost:3000/login`;
  let subject, text, html;

  if (status === 'approved') {
    subject = 'Your Doctor Account has been Approved';
    text = `Congratulations, your account has been approved by the admin! You can now log in to your account using the following link: ${link}`;
    html = `<p>Congratulations, your account has been approved by the admin!</p>
            <p>You can now log in to your account using the following link: 
            <a href="${link}" style="background-color:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Login</a></p>`;
  } else if (status === 'rejected') {
    subject = 'Your Doctor Account has been Rejected';
    text = 'Unfortunately, your account has been rejected by the admin.';
    html = `<p>Unfortunately, your account has been rejected by the admin.</p>`;
  }

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending status email:', error);
    throw new Error('Error sending email notification');
  }
};

// Admin Approve/Reject doctor
exports.adminApproveRejectDoctor = async (req, res) => {
  try {
    const { doctorId, action } = req.body;

    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to approve doctors." });
    }

    const doctor = await userModel.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: "Doctor not found or invalid role." });
    }

    const notification = await Notification.findOne({ doctorId: doctor._id, read: false });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (action === 'approve') {
      doctor.isApproved = true;
      await doctor.save();
      notification.message = `Doctor ${doctor.name} has been approved.`;
      notification.read = true;
      await notification.save();
      await sendDoctorStatusEmail(doctor.email, 'approved');
      return res.status(200).json({ message: "Doctor has been approved successfully." });
    } else if (action === 'reject') {
      await doctor.deleteOne();
      notification.message = `Doctor ${doctor.name} has been rejected.`;
      notification.read = true;
      await notification.save();
      await sendDoctorStatusEmail(doctor.email, 'rejected');
      return res.status(200).json({ message: "Doctor registration has been rejected." });
    } else {
      return res.status(400).json({ message: "Invalid action. Must be either 'approve' or 'reject'." });
    }
  } catch (error) {
    console.error("Error in admin approval:", error);
    res.status(500).json({ message: "Error in approval process.", error: error.message });
  }
};

// Get all notifications (Doctor registrations and flagged reviews)
exports.getAllNotifications = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Fetch doctor registration notifications
    const doctorNotifications = await Notification.find({ adminId: req.user._id })
      .populate('doctorId', 'name phone email licenseNo location practice certificate')
      .lean();

    // Fetch flagged review notifications
    const flaggedNotifications = await FlaggedReviewNotification.find({ adminId: req.user._id })
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .populate('reviewId', 'rating reviewText')
      .populate('flaggedReviewId', 'reason status adminNotes')
      .lean();

    // Combine and format notifications
    const combinedNotifications = [
      ...doctorNotifications.map(notif => ({
        _id: notif._id,
        message: notif.message,
        read: notif.read,
        createdAt: notif.createdAt,
        type: 'doctor_registration',
        doctor: notif.doctorId ? {
          name: notif.doctorId.name,
          phone: notif.doctorId.phone,
          email: notif.doctorId.email,
          licenseNo: notif.doctorId.licenseNo,
          location: notif.doctorId.location,
          practice: notif.doctorId.practice,
          certificate: notif.doctorId.certificate?.data ? {
            contentType: notif.doctorId.certificate.contentType || 'application/pdf',
            data: Buffer.isBuffer(notif.doctorId.certificate.data)
              ? notif.doctorId.certificate.data.toString('base64')
              : notif.doctorId.certificate.data
          } : null
        } : null
      })),
      ...flaggedNotifications.map(notif => ({
        _id: notif._id,
        message: notif.message,
        read: notif.read,
        createdAt: notif.createdAt,
        type: 'flagged_review',
        doctor: notif.doctorId ? { name: notif.doctorId.name, email: notif.doctorId.email } : null,
        patient: notif.patientId ? { name: notif.patientId.name, email: notif.patientId.email } : null,
        review: notif.reviewId ? { rating: notif.reviewId.rating, reviewText: notif.reviewId.reviewText } : null,
        flaggedReview: notif.flaggedReviewId ? {
          reason: notif.flaggedReviewId.reason,
          status: notif.flaggedReviewId.status,
          adminNotes: notif.flaggedReviewId.adminNotes
        } : null
      }))
    ];

    // Sort by createdAt (descending)
    combinedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const paginatedNotifications = combinedNotifications.slice(skip, skip + limit);
    const total = combinedNotifications.length;

    res.status(200).json({
      success: true,
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    res.status(500).json({ success: false, message: "Server error while fetching notifications" });
  }
};

// Get notifications with certificate data
exports.getNotifications = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ adminId: req.user._id })
      .populate('doctorId', 'name phone email licenseNo location practice certificate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedNotifications = notifications.map(notification => {
      const doctor = notification.doctorId;
      const certificateData = doctor?.certificate?.data ? {
        contentType: doctor.certificate.contentType || 'application/pdf',
        data: Buffer.isBuffer(doctor.certificate.data) ? doctor.certificate.data.toString('base64') : doctor.certificate.data
      } : null;

      return {
        _id: notification._id,
        message: notification.message,
        adminId: notification.adminId,
        doctorId: doctor?._id,
        read: notification.read,
        createdAt: notification.createdAt,
        doctor: doctor ? {
          name: doctor.name,
          phone: doctor.phone,
          email: doctor.email,
          licenseNo: doctor.licenseNo,
          location: doctor.location,
          practice: doctor.practice,
          certificate: certificateData
        } : null
      };
    });

    const total = await Notification.countDocuments({ adminId: req.user._id });

    res.status(200).json({
      notifications: formattedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const notification = await Notification.findOne({ _id: id, adminId })
      .populate('adminId', 'name email')
      .populate('doctorId', 'name email licenseNo');
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found or you are not authorized' });
    }

    if (notification.read) {
      return res.status(400).json({ success: false, message: 'Notification is already marked as read' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark flagged review notification as read
exports.markFlaggedReviewNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const notification = await FlaggedReviewNotification.findOne({ _id: id, adminId })
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .populate('reviewId', 'rating reviewText')
      .populate('flaggedReviewId', 'reason status adminNotes');
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found or unauthorized' });
    }

    if (notification.read) {
      return res.status(400).json({ success: false, message: 'Notification already marked as read' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

exports.getUnreadNotificationCount = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
    }

    const unreadDoctorCount = await Notification.countDocuments({
      adminId: req.user._id,
      read: false
    });

    const unreadFlaggedCount = await FlaggedReviewNotification.countDocuments({
      adminId: req.user._id,
      read: false
    });

    const unreadCount = unreadDoctorCount + unreadFlaggedCount;

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching unread count"
    });
  }
};

// Other existing controllers (omitted for brevity)
exports.users = async (req, res) => {
  try {
    const users = await userModel.find({ role: { $ne: 'Admin' } }).select('username email avatar');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentUsers = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to view this data." });
    }

    const totalUsers = await userModel.countDocuments({ role: { $ne: 'admin' } });
    const totalDoctors = await userModel.countDocuments({ role: 'doctor' });
    const totalPatients = await userModel.countDocuments({ role: 'patient' });
    const pendingDoctors = await userModel.countDocuments({ role: 'doctor', isApproved: false });

    const recentDoctors = await userModel
      .find({ role: 'doctor' })
      .select('name email phone licenseNo location practice isApproved createdAt photo')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPatients = await userModel
      .find({ role: 'patient' })
      .select('name email phone location createdAt photo')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedDoctors = recentDoctors.map(doctor => {
      const photoData = doctor.photo && doctor.photo.data ? {
        contentType: doctor.photo.contentType || 'image/png',
        data: Buffer.isBuffer(doctor.photo.data) ? doctor.photo.data.toString('base64') : doctor.photo.data
      } : null;

      return {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        licenseNo: doctor.licenseNo,
        location: doctor.location,
        practice: doctor.practice,
        isApproved: doctor.isApproved,
        createdAt: doctor.createdAt,
        photo: photoData
      };
    });

    const formattedPatients = recentPatients.map(patient => {
      const photoData = patient.photo && patient.photo.data ? {
        contentType: patient.photo.contentType || 'image/png',
        data: Buffer.isBuffer(patient.photo.data) ? patient.photo.data.toString('base64') : patient.photo.data
      } : null;

      return {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        location: patient.location,
        createdAt: patient.createdAt,
        photo: photoData
      };
    });

    res.status(200).json({
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingDoctors,
      recentDoctors: formattedDoctors,
      recentPatients: formattedPatients
    });
  } catch (error) {
    console.error("Error fetching recent users and counts:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to view this data." });
    }

    const totalUsers = await userModel.countDocuments({ role: { $ne: 'admin' } });
    const totalDoctors = await userModel.countDocuments({ role: 'doctor' });
    const totalPatients = await userModel.countDocuments({ role: 'patient' });
    const pendingDoctors = await userModel.countDocuments({ role: 'doctor', isApproved: false });

    const recentDoctors = await userModel
      .find({ role: 'doctor' })
      .select('name email phone licenseNo location practice isApproved isActive createdAt photo')
      .sort({ createdAt: -1 });

    const formattedDoctors = recentDoctors.map(doctor => {
      const photoData = doctor.photo && doctor.photo.data ? {
        contentType: doctor.photo.contentType || 'image/png',
        data: Buffer.isBuffer(doctor.photo.data) ? doctor.photo.data.toString('base64') : doctor.photo.data
      } : null;

      return {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        licenseNo: doctor.licenseNo,
        location: doctor.location,
        practice: doctor.practice,
        isApproved: doctor.isApproved,
        isActive: doctor.isActive,
        createdAt: doctor.createdAt,
        photo: photoData
      };
    });

    const recentPatients = await userModel
      .find({ role: 'patient' })
      .select('name email phone location createdAt photo')
      .sort({ createdAt: -1 });

    const formattedPatients = recentPatients.map(patient => {
      const photoData = patient.photo && patient.photo.data ? {
        contentType: patient.photo.contentType || 'image/png',
        data: Buffer.isBuffer(patient.photo.data) ? doctor.photo.data.toString('base64') : patient.photo.data
      } : null;

      return {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        location: patient.location,
        createdAt: patient.createdAt,
        photo: photoData
      };
    });

    res.status(200).json({
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingDoctors,
      recentDoctors: formattedDoctors,
      recentPatients: formattedPatients
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can delete users." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete admin accounts." });
    }

    await user.deleteOne();

    if (user.role === 'doctor') {
      const notification = await Notification.findOne({ doctorId: user._id, read: false });
      if (notification) {
        notification.message = `Doctor ${user.name} has been deleted by admin.`;
        notification.read = true;
        await notification.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been deleted successfully.`
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
  }
};

exports.addSeniorDoctor = async (req, res) => {
  try {
    const { name, email, phone, practice, location, licenseNo } = req.fields;
    const photo = req.files?.photo;

    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can add senior doctors." });
    }

    if (!name || !email || !phone || !practice || !location || !licenseNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const seniorDoctorData = {
      name,
      email,
      phone,
      password: hashedPassword,
      practice,
      location,
      licenseNo,
      role: 'doctor',
      isApproved: true,
      isFirstLogin: true
    };

    if (photo) {
      seniorDoctorData.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type
      };
      fs.unlink(photo.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    const seniorDoctor = new userModel(seniorDoctorData);
    await seniorDoctor.save();

    await sendSeniorDoctorEmail(name, email, practice, tempPassword);

    res.status(201).json({
      success: true,
      message: "Senior doctor added successfully and email sent.",
      doctor: { id: seniorDoctor._id, name, email }
    });
  } catch (error) {
    console.error("Error adding senior doctor:", error);
    res.status(500).json({ success: false, message: "Error adding senior doctor", error: error.message });
  }
};

const sendSeniorDoctorEmail = async (name, email, practice, tempPassword) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  });

  const loginLink = "http://localhost:3000/login";
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: `Welcome to Our Top Doctors List, Dr. ${name}!`,
    text: `Hey Dr. ${name}, we featured you on our site as one of the top doctors in ${practice}. You're welcome to claim your profile to manage it or let us know if you'd prefer not to be listed.\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${tempPassword}\nPlease log in at ${loginLink} and change your password immediately.`,
    html: `<p>Hey Dr. ${name},</p>
           <p>We featured you on our site as one of the top doctors in <strong>${practice}</strong>.</p>
           <p>You're welcome to <a href="${loginLink}">claim your profile</a> to manage it or let us know if you'd prefer not to be listed.</p>
           <p>Here are your login credentials:</p>
           <ul>
             <li><strong>Email:</strong> ${email}</li>
             <li><strong>Password:</strong> ${tempPassword}</li>
           </ul>
           <p>Please <a href="${loginLink}">log in</a> and change your password immediately.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email to senior doctor:', error);
    throw new Error('Error sending email');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can update users." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot update admin accounts." });
    }

    const isBeingDeactivated = updateData.isActive === false && user.isActive !== false;
    const isBeingReactivated = updateData.isActive === true && user.isActive === false;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    if (user.role === 'doctor') {
      if (isBeingDeactivated) {
        const notification = new Notification({
          adminId: admin._id,
          doctorId: user._id,
          message: `Doctor ${user.name}'s account has been deactivated.`,
          read: false
        });
        await notification.save();
      } else if (isBeingReactivated) {
        const notification = new Notification({
          adminId: admin._id,
          doctorId: user._id,
          message: `Doctor ${user.name}'s account has been reactivated.`,
          read: false
        });
        await notification.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been updated successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        practice: user.practice,
        licenseNo: user.licenseNo,
        isApproved: user.isApproved,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};