const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const JWT = require('jsonwebtoken');
const authenticate = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require("dotenv").config();
const fs = require("fs");
const Notification = require('../models/Notification'); // Import Notification model

// Generate a 6-digit OTP
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with OTP
const sendVerificationOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please verify your email address using the verification code below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
        </div>
        <p>Enter this code on the verification page to complete your registration.</p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Set default role for patient
    const role = "patient";

    // Validations
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login instead" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the user with OTP
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role,
      verificationOTP: otp,
      verificationOTPExpires: otpExpiration,
      isVerified: false,
    });
    await user.save();

    // Send OTP to user's email
    await sendVerificationOTP(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     // Set default role for patient
//     const role = "patient"; // Default role for patients

//     // Validations
//     if (!name || !email || !password || !confirmPassword ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if password and confirmPass are the same
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check if password is at least 6 characters long
//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password should be at least 6 characters long" });
//     }

//     // Check if the user already exists
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists, please login instead" });
//     }

//     // Hash the password using bcrypt
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

//     // Register the user
//     const user = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//       confirmPassword: hashedPassword,
//       role, // Role is automatically set as "patient"
//     });
//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error in registration", error });
//   }
// };

// Doctor Registration
exports.docRegister = async (req, res) => {
  try {
    const { name, email, password, phone, practice, location, licenseNo, role } = req.fields; // Use req.fields for formidable
    const { certificate } = req.files; // Get certificate file from req.files

    // Validations
    if (!name || !email || !password || !phone || !licenseNo || !practice || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!certificate) {
      return res.status(400).json({ message: "Certificate file is required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }
    if (phone.length !== 10) {
      return res.status(400).json({ message: "Phone no. should be at least 10 digits." });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (role !== 'doctor') {
      return res.status(400).json({ message: "Invalid role for this route" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login instead." });
    }
    // Check if the doctor's license already exists
    const existingLicense = await userModel.findOne({ licenseNo });
    if (existingLicense) {
      return res.status(400).json({ message: "Doctor's license no already exists." });
    }

    // Read certificate file
    const certificateData = fs.readFileSync(certificate.path);
    const certificateContentType = certificate.type;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Create and save the user with certificate and OTP
    const user = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      licenseNo,
      location,
      practice,
      role,
      isApproved: false,
      certificate: {
        data: certificateData,
        contentType: certificateContentType,
      },
      // verificationOTP: otp,
      // verificationOTPExpires: otpExpiration,
      // isVerified: false,
    });
    await user.save();

    // Fetch the admin user
    const admin = await userModel.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(500).json({ message: "Admin not found. Unable to send notification." });
    }

    // Create a notification for the admin about the new doctor registration
    const notification = new Notification({
      message: `A new doctor ${name} has registered and is awaiting approval.`,
      adminId: admin._id,
      doctorId: user._id,
    });
    await notification.save();

    // Send OTP to doctor's email
    // await sendVerificationOTP(email, otp);

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully. OTP sent to your email. Please verify to complete registration.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error in doctor registration:", error);
    res.status(500).json({ success: false, message: "Error in registration", error: error.message });
  }
};

// Verify OTP endpoint
exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }

    const user = await userModel.findOne({
      email,
      verificationOTP: otp,
      verificationOTPExpires: { $gt: Date.now() },
      isVerified: false,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();


    res.status(200).json({
      success: true,
      message: "Email successfully verified. You can now log in.",
      redirect: `${process.env.FRONTEND_URL}/login`,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Error verifying email", error });
  }
};

// Resend OTP verification
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({ message: "User not found or already verified" });
    }

    // Generate new OTP
    const verificationOTP = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationOTP = verificationOTP;
    user.verificationOTPExpires = otpExpiration;
    await user.save();

    // Send verification email with new OTP
    await sendVerificationOTP(email, verificationOTP);

    res.status(200).json({
      success: true,
      message: "Verification code resent. Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error resending verification code", error });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    // Check if user is verified (only for non-doctors)
    if (user.role !== 'doctor' && !user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Check if doctor account is approved
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: 'Admin needs to approve your account before you can log in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If doctor and inactive, reactivate the account
    if (user.role === 'doctor' && !user.isActive && user.isApproved) {
      user.isActive = true;
      await user.save();
    }

    const token = JWT.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Include isFirstLogin and isActive in the response
    const isFirstLogin = user.isFirstLogin;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isActive: user.isActive,
        isFirstLogin // Will be true only for admin-added senior doctors
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

const sendPasswordResetEmail = async (email, accessToken) => {
  const resetLink = `http://localhost:3000/forgot-password?token=${accessToken}&email=${email}`;

  const mailOptions = {
    from: 'np03cs4a220023@heraldcollege.edu.np', // sender address
    to: email, // receiver address
    subject: 'Password Reset Request', // Subject line
    text: `You requested for a password reset. Click the link to reset your password: ${resetLink}`,
    html: `<p>You requested for a password reset.</p><p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a reset token
    const accessToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // 1 hour from now

    // Update user record with the reset token and expiration
    user.resetPasswordToken = accessToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, accessToken);

    res.status(200).send({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// Fix for resetPassword
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Find the user by email and reset token
    const user = await userModel.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ message: "Something went wrong", error });
  }
};

// User info route
exports.userInfo = async (req, res) => {
  try {
    // Assuming req.user.id contains the user ID
    const user = await userModel.findById(req.user.id);

    if (!user) {
      // Return a 404 if the user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data as JSON if found
    res.json(user);
  } catch (error) {
    // Handle specific errors (e.g., database connection issues)
    console.error(error);  // Log error details for debugging purposes
    res.status(500).json({
      message: 'Server error, unable to fetch user data',
      error: error.message || 'Internal Server Error'
    });
  }
};

