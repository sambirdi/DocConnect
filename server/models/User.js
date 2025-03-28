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
  phone: { type: String},
  practice: { type: String},
  location: { type: String},
  licenseNo: {type: String},
  about: {type: String},
  institution: {type: String},
  experience: {type: String},
  qualification: {type: String},
  workplace: {type: String},
  role: {
    type: String,
    enum: ["doctor", "patient", "admin"], // Allowed roles
    default: "patient", // Default for auto-assigned role
  },
  photo: {
    data: Buffer, 
    contentType: String, 
  },
  isApproved: { type: Boolean, default: false }, // New field for approval status
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