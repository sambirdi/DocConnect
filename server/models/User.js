const { text } = require('body-parser');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String},
  fname: { type: String },
  lname: { type: String},
  username: {type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword : {type: String},
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Must be exactly 10 digits
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  practice: { type: String},
  location: { type: String},
  licenseNo: {
    type: String,
    unique: true,
    sparse: true // Allows uniqueness check only when licenseNo is present
  },
  about: {type: String},
  institution: {type: String},
  experience: {type: String},
  qualification: {type: String},
  workplace: {type: String},
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    default: null
  },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  role: {
    type: String,
    enum: ["doctor", "patient", "admin"], // Allowed roles
    default: "patient", // Default for auto-assigned role
  },
  photo: {
    data: Buffer, 
    contentType: String, 
  },
  certificate: {
    data: Buffer, 
    contentType: String, 
  },
  isApproved: { type: Boolean, default: false }, // New field for approval status
  isActive: { type: Boolean, default: true }, // New field for approval status
  isFirstLogin: { type: Boolean, default: false }, // Default false, only true for admin-added senior doctors
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: { type: String },
  verificationOTPExpires: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
},  { timestamps: true }// Add timestamps here
); 


userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = mongoose.model('User', userSchema);