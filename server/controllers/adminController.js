const nodemailer = require('nodemailer');
const userModel = require('../models/User');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: process.env.USER_EMAIL, // Your email address (from .env)
    pass: process.env.USER_PASS,  // Your email password or app-specific password
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
    from: process.env.USER_EMAIL, // Sender's email address
    to: email, // Receiver's email (doctor)
    subject: subject, // Email subject
    text: text, // Plain text message
    html: html, // HTML message
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
    const { doctorId, action } = req.body; // action could be "approve" or "reject"

    // Check if the admin is authenticated (you can customize this with your actual admin check)
    const admin = req.user; // Assuming admin is in req.user after authentication
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to approve doctors." });
    }

    // Find the doctor
    const doctor = await userModel.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: "Doctor not found or invalid role." });
    }

    // Find the notification for this doctor registration
    const notification = await Notification.findOne({ doctorId: doctor._id, read: false });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Handle approval
    if (action === 'approve') {
      doctor.isApproved = true; // Set isApproved to true if approved
      await doctor.save();

      // Update the notification message
      notification.message = `Doctor ${doctor.name} has been approved.`;
      notification.read = true; // Mark it as read after approval
      await notification.save();

      // Send email to the doctor about approval
      await sendDoctorStatusEmail(doctor.email, 'approved');

      return res.status(200).json({ message: "Doctor has been approved successfully." });
    } 
    // Handle rejection
    else if (action === 'reject') {
      await doctor.deleteOne(); // Remove the doctor from the system if rejected

      // Update the notification message
      notification.message = `Doctor ${doctor.name} has been rejected.`;
      notification.read = true; // Mark it as read after rejection
      await notification.save();

      // Send email to the doctor about rejection
      await sendDoctorStatusEmail(doctor.email, 'rejected');

      return res.status(200).json({ message: "Doctor registration has been rejected." });
    } 
    // Invalid action
    else {
      return res.status(400).json({ message: "Invalid action. Must be either 'approve' or 'reject'." });
    }
  } catch (error) {
    console.error("Error in admin approval:", error);
    res.status(500).json({ message: "Error in approval process.", error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Validate authenticated user
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Pagination parameters (default: page 1, limit 6)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Fetch notifications with pagination
    const notifications = await Notification.find({ adminId: req.user._id })
      .populate('doctorId', 'name phone email licenseNo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Optional: Get total count for pagination metadata
    const total = await Notification.countDocuments({ adminId: req.user._id });

    res.status(200).json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
};

// Controller to mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true; // Set the read status to true
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

//all users
exports.users = async (req, res) => {
  try {
      const users = await userModel.find({
          role: { $ne: 'Admin' }     // Exclude users with role 'admin'
      }).select('username email avatar');
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
  }
}

// Controller to fetch recent doctors and patients
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
        contentType: doctor.photo.contentType || 'image/png', // Fallback MIME type
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
      recentPatients: formattedPatients,
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
      .select('name email phone licenseNo location practice isApproved createdAt photo')
      .sort({ createdAt: -1 });

    const recentPatients = await userModel
      .find({ role: 'patient' })
      .select('name email phone location createdAt photo')
      .sort({ createdAt: -1 });

    const formattedDoctors = recentDoctors.map(doctor => {
      const photoData = doctor.photo && doctor.photo.data ? {
        contentType: doctor.photo.contentType || 'image/png', // Fallback MIME type
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
      recentPatients: formattedPatients,
    });
  } catch (error) {
    console.error("Error fetching recent users and counts:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

exports.addSeniorDoctor = async (req, res) => {
  try {
    const { name, email, phone, practice, location, licenseNo } = req.body;

    // Validate admin access
    const admin = req.user;
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can add senior doctors." });
    }

    // Validations
    if (!name || !email || !phone || !practice || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the doctor already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Generate a temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex'); // e.g., "a1b2c3d4"
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create the senior doctor
    const seniorDoctor = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      practice,
      location,
      role: 'doctor',
      isApproved: true, // Senior doctors are auto-approved
      isFirstLogin: true, // Flag for first login, only for admin-added doctors
    });
    await seniorDoctor.save();

    // Send a single email
    await sendSeniorDoctorEmail(name, email, practice, tempPassword);

    res.status(201).json({
      success: true,
      message: "Senior doctor added successfully and email sent.",
      doctor: { id: seniorDoctor._id, name, email },
    });
  } catch (error) {
    console.error("Error adding senior doctor:", error);
    res.status(500).json({ success: false, message: "Error adding senior doctor", error: error.message });
  }
};

// Function to send a single email to senior doctors
const sendSeniorDoctorEmail = async (name, email, practice, tempPassword) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
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
           <p>Please <a href="${loginLink}">log in</a> and change your password immediately.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email to senior doctor:', error);
    throw new Error('Error sending email');
  }
};