const bcrypt = require("bcryptjs");
const userModel = require("../models/User");
const reviewModel = require("../models/reviews");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const { agentBuilder } = require("../agent/doctorSearchAgent");

// update profile
exports.updateDocProfileController = async (req, res) => {
  try {
    const {
      name,
      phone,
      practice,
      location,
      experience,
      institution,
      qualification,
      about,
      workplace,
    } = req.fields;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const photo = req.files?.photo;
    const updatedFields = {
      name: name || user.name,
      phone: phone || user.phone,
      practice: practice || user.practice,
      location: location || user.location,
      experience: experience || user.experience,
      institution: institution || user.institution,
      qualification: qualification || user.qualification,
      about: about || user.about,
      workplace: workplace || user.workplace,
    };

    if (photo) {
      updatedFields.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
      // Clean up temp file
      fs.unlink(
        photo.path,
        (err) => err && console.error("Failed to delete temp file:", err)
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

// get user photo
exports.docPhotoController = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userId).select("photo");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.photo?.data) {
      return res
        .status(404)
        .json({ success: false, message: "Photo not found" });
    }

    res.set("Content-Type", user.photo.contentType);
    res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
    res.status(200).send(user.photo.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting user photo",
      error: error.message,
    });
  }
};
// Get a specific doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid doctor ID" });
    }

    const doctor = await userModel
      .findOne({ _id: id, role: "doctor" })
      .select(
        "name email phone location practice licenseNo experience institution qualification about photo isApproved"
      );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Format photo data if it exists
    const photoData =
      doctor.photo && doctor.photo.data
        ? {
          contentType: doctor.photo.contentType || "image/png",
          data: Buffer.isBuffer(doctor.photo.data)
            ? doctor.photo.data.toString("base64")
            : doctor.photo.data,
        }
        : null;

    const doctorData = {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      location: doctor.location,
      practice: doctor.practice,
      licenseNo: doctor.licenseNo,
      experience: doctor.experience,
      institution: doctor.institution,
      qualification: doctor.qualification,
      about: doctor.about,
      workplace: doctor.workplace,
      isApproved: doctor.isApproved,
      photo: photoData,
    };

    res.status(200).json({ success: true, doctor: doctorData });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error.message,
    });
  }
};

exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.query;
    const doctors = await userModel
      .find({
        role: "doctor",
        practice: { $regex: new RegExp(`^${specialty}$`, "i") }, // Case-insensitive match
        isApproved: true,
      })
      .select("name phone location practice photo about");

    // Fetch reviews for all doctors in one query
    const doctorIds = doctors.map((doctor) => doctor._id);
    const reviews = await reviewModel
      .find({ doctorId: { $in: doctorIds } })
      .populate("patientId", "name")
      .select("doctorId rating reviewText createdAt");


    const formattedDoctors = doctors.map((doctor) => {
      // Filter reviews for this doctor
      const doctorReviews = reviews.filter((review) =>
        review.doctorId.equals(doctor._id)
      );

      // Calculate average rating
      const totalReviews = doctorReviews.length;
      const averageRating =
        totalReviews > 0
          ? (
            doctorReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
          : 0;

      // Format reviews
      const formattedReviews = doctorReviews.map((review) => ({
        patientName: review.patientId.name,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
      }));
      return {
        id: doctor._id,
        name: doctor.name,
        phone: doctor.phone,
        location: doctor.location,
        specialty: doctor.practice,
        about: doctor.about,
        photo: doctor.photo?.data
          ? {
            contentType: doctor.photo.contentType,
            data: doctor.photo.data.toString("base64"),
          }
          : null,
        reviews: {
          averageRating,
          totalReviews,
          reviews: formattedReviews,
        },
      };
  });

    res.status(200).json({ success: true, doctors: formattedDoctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Error fetching doctors" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id; // From authenticated user

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Reset the first login flag if it was true
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Error changing password", error: error.message });
  }
};

// Get all doctors
// exports.getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await userModel
//       .find({ role: "doctor", isApproved: true })
//       .select("name phone location practice about photo institution experience qualification workplace");

//     const formattedDoctors = doctors.map((doctor) => ({
//       id: doctor._id,
//       name: doctor.name,
//       phone: doctor.phone,
//       location: doctor.location,
//       practice: doctor.practice,
//       about: doctor.about,
//       institution: doctor.institution,
//       experience: doctor.experience,
//       qualification: doctor.qualification,
//       workplace: doctor.workplace,
//       photo: doctor.photo?.data
//         ? {
//           contentType: doctor.photo.contentType,
//           data: doctor.photo.data.toString("base64"),
//         }
//         : null,
//     }));

//     res.status(200).json({
//       success: true,
//       message: "Doctors retrieved successfully",
//       doctors: formattedDoctors,
//     });
//   } catch (error) {
//     console.error("Error fetching all doctors:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching doctors",
//       error: error.message,
//     });
//   }
// };

// Get all doctors (most recent 4 for featured section)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await userModel
      .find({ role: "doctor", isApproved: true })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(4) // Limit to 4 doctors
      .select("name phone location practice about photo institution experience qualification workplace");

    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor._id,
      name: doctor.name,
      phone: doctor.phone,
      location: doctor.location,
      practice: doctor.practice,
      about: doctor.about,
      institution: doctor.institution,
      experience: doctor.experience,
      qualification: doctor.qualification,
      workplace: doctor.workplace,
      photo: doctor.photo?.data
        ? {
            contentType: doctor.photo.contentType,
            data: doctor.photo.data.toString("base64"),
          }
        : null,
    }));

    res.status(200).json({
      success: true,
      message: "Recent doctors retrieved successfully",
      doctors: formattedDoctors,
    });
  } catch (error) {
    console.error("Error fetching recent doctors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

exports.searchDoctor = async (req, res) => {
  const { symptoms, location } = req.query;
  try {
    // Validate input
    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: "Symptoms are required",
      });
    }

    // Invoke agentBuilder
    const messages = [
      {
        role: "user",
        content: symptoms,
      },
    ];
    const result = await agentBuilder.invoke({ messages });

    if (!result.messages || result.messages.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No doctors found for the given symptoms",
        data: [],
      });
    }

    const response = result.messages[result.messages.length - 1].content;

    // Log for debugging
    // console.log("Raw agentBuilder response:", response);

    // Clean response
    let cleanedResponse = response
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "")
      .trim();

    // console.log("Cleaned response:", cleanedResponse);

    let stringArray = [];
    try {
      // Try parsing as JSON
      stringArray = JSON.parse(cleanedResponse);
      // Ensure it's an array and contains valid ObjectIds
      if (!Array.isArray(stringArray)) {
        throw new Error("Response is not an array");
      }
      stringArray = stringArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
    } catch (error) {
      console.error("Error parsing string array:", error);
      // Fallback: try parsing raw response or assume empty
      try {
        stringArray = JSON.parse(response);
        if (!Array.isArray(stringArray)) {
          throw new Error("Raw response is not an array");
        }
        stringArray = stringArray.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
      } catch (fallbackError) {
        // console.error("Fallback parsing failed:", fallbackError);
        return res.status(200).json({
          success: true,
          message: "No doctors found due to invalid response format",
          data: [],
        });
      }
    }

    if (stringArray.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No valid doctor IDs found for the given symptoms",
        data: [],
      });
    }

    // console.log("Parsed stringArray:", stringArray);

    // Query doctors
    const query = {
      _id: { $in: stringArray.map((id) => new mongoose.Types.ObjectId(id)) },
      role: "doctor",
      isApproved: true,
    };
    if (location) {
      query.location = { $regex: location, $options: "i" }; // Partial match
    }

    const doctors = await userModel.find(query).select(
      "name phone practice location about workplace institution experience qualification photo"
    );

    // Fetch reviews for all doctors in one query
    const doctorIds = doctors.map((doc) => doc._id);
    const reviews = await reviewModel
      .find({ doctorId: { $in: doctorIds } })
      .populate("patientId", "name")
      .select("doctorId rating reviewText createdAt");


    // Format response
    const formattedDoctors = doctors.map((doc) => {
      // Filter reviews for this doctor
      const doctorReviews = reviews.filter((review) =>
        review.doctorId.equals(doc._id)
      );

      // Calculate average rating
      const totalReviews = doctorReviews.length;
      const averageRating =
        totalReviews > 0
          ? (
            doctorReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
          : 0;

      // Format reviews
      const formattedReviews = doctorReviews.map((review) => ({
        patientName: review.patientId.name,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
      }));

      return {
        _id: doc._id,
        name: doc.name,
        phone: doc.phone,
        practice: doc.practice,
        location: doc.location,
        about: doc.about,
        workplace: doc.workplace,
        institution: doc.institution,
        experience: doc.experience,
        qualification: doc.qualification,
        photo: doc.photo?.data
          ? {
            contentType: doc.photo.contentType,
            data: doc.photo.data.toString("base64"),
          }
          : null,
        reviews: {
          averageRating,
          totalReviews,
          reviews: formattedReviews,
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: formattedDoctors,
    });
  } catch (error) {
    console.error("Error searching for doctors:", error);
    res.status(500).json({
      success: false,
      message: "Error searching doctors",
      error: error.message,
    });
  }
};
