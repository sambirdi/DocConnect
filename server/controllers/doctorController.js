const bcrypt = require("bcryptjs");
const userModel = require("../models/User");
const reviewModel = require("../models/reviews");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const { agentBuilder } = require("../agent/doctorSearchAgent");

// Update profile
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
      gender,
    } = req.fields;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if a photo was uploaded
    const photo = req.files?.photo;
    // Prepare updated fields
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
      gender: gender || user.gender,
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

    // Geocode workplace if it has changed
    if (workplace && workplace !== user.workplace) {
      console.log(`Geocoding workplace for ${user.name}: ${workplace}`);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            `${workplace}, Kathmandu, Nepal`
          )}`,
          { headers: { 'User-Agent': 'DoctorFinder/1.0 (contact@doctorfinder.com)' } }
        );

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          updatedFields.latitude = parseFloat(lat);
          updatedFields.longitude = parseFloat(lon);
          // console.log(`Updated coordinates for ${user.name}: lat=${lat}, lon=${lon}`);
        } else {
          console.warn(`No coordinates found for workplace: ${workplace}`);
          // Optionally, set latitude and longitude to null or leave unchanged
          updatedFields.latitude = null;
          updatedFields.longitude = null;
        }
      } catch (geocodeError) {
        // console.error(`Geocoding error for ${workplace}:`, geocodeError.message);
        // Optionally, set latitude and longitude to null or leave unchanged
        updatedFields.latitude = null;
        updatedFields.longitude = null;
      }
      // Respect Nominatim rate limit (1 request per second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
        "name email phone location practice licenseNo experience workplace institution qualification about photo isApproved latitude longitude"
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
      latitude: doctor.latitude,
      longitude: doctor.longitude,
      isApproved: doctor.isApproved,
      gender: doctor.gender,
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
        practice: { $regex: new RegExp(`^${specialty}$`, "i") },
        isApproved: true,
        isActive: true
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
        patientName: review.patientId?.name || "Unknown Patient", // Handle null patientId
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

// Get all doctors (most recent 4 for featured section)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await userModel
      .find({ role: "doctor", isApproved: true, isActive: true })
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
  const { symptoms, location, gender, experience, rating } = req.query;
  try {
    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: "Symptoms are required",
      });
    }

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

    let cleanedResponse = response
      .replace(/```json\n?/, "")
      .replace(/\n?```/, "")
      .replace(/^\s*[\{\[]\s*/, "")
      .replace(/\s*[\]\}]\s*$/, "")
      .trim();

    if (!cleanedResponse || cleanedResponse === "[]") {
      return res.status(200).json({
        success: true,
        message: "No doctors found for the given symptoms",
        data: [],
      });
    }

    let stringArray = [];
    try {
      stringArray = JSON.parse(`[${cleanedResponse}]`);
      if (!Array.isArray(stringArray)) {
        throw new Error("Response is not an array");
      }
      stringArray = stringArray.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
    } catch (error) {
      try {
        stringArray = JSON.parse(response);
        if (!Array.isArray(stringArray)) {
          throw new Error("Raw response is not an array");
        }
        stringArray = stringArray.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
      } catch (fallbackError) {
        const idRegex = /[0-9a-fA-F]{24}/g;
        stringArray = response.match(idRegex) || [];
        stringArray = stringArray.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (stringArray.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No doctors found due to invalid response format",
            data: [],
          });
        }
      }
    }

    if (stringArray.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No valid doctor IDs found for the given symptoms",
        data: [],
      });
    }

    const query = {
      _id: { $in: stringArray.map((id) => new mongoose.Types.ObjectId(id)) },
      role: "doctor",
      isApproved: true,
      isActive: true
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (gender) {
      query.gender = { $regex: `^${gender}$`, $options: "i" };
    }

    // Parse experience range
    let experienceFilter = null;
    if (experience) {
      const [minExp, maxExp] = experience.split("-").map(Number);
      experienceFilter = { minExp, maxExp: maxExp === 999 ? Number.MAX_SAFE_INTEGER : maxExp };
    }

    // Fetch doctors and their reviews in an aggregation pipeline
    const doctorsAggregation = await userModel.aggregate([
      { $match: query },
      {
        $addFields: {
          parsedExperience: {
            $cond: {
              if: { $eq: ["$experience", null] },
              then: 0,
              else: {
                $toInt: {
                  $arrayElemAt: [
                    { $split: ["$experience", " "] },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      ...(experienceFilter
        ? [{
            $match: {
              parsedExperience: {
                $gte: experienceFilter.minExp,
                $lte: experienceFilter.maxExp
              }
            }
          }]
        : []),
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "doctorId",
          as: "reviewsData"
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviewsData" }, 0] },
              then: {
                $divide: [
                  { $sum: "$reviewsData.rating" },
                  { $size: "$reviewsData" }
                ]
              },
              else: 0
            }
          },
          totalReviews: { $size: "$reviewsData" }
        }
      },
      ...(rating
        ? [{
            $match: {
              averageRating: { $gte: Number(rating) }
            }
          }]
        : []),
      {
        $project: {
          name: 1,
          phone: 1,
          practice: 1,
          location: 1,
          about: 1,
          workplace: 1,
          institution: 1,
          experience: 1,
          parsedExperience: 1,
          qualification: 1,
          gender: 1,
          photo: 1,
          averageRating: 1,
          totalReviews: 1,
          reviewsData: {
            $map: {
              input: "$reviewsData",
              as: "review",
              in: {
                patientName: {
                  $cond: [
                    { $eq: ["$$review.patientId", null] },
                    "Anonymous",
                    "$$review.patientId.name"
                  ]
                },
                rating: "$$review.rating",
                reviewText: "$$review.reviewText",
                createdAt: "$$review.createdAt"
              }
            }
          }
        }
      }
    ]);

    // Populate patient names for reviews
    const doctors = await userModel.populate(doctorsAggregation, {
      path: "reviewsData.patientId",
      select: "name"
    });

    const formattedDoctors = doctors.map((doc) => {
      const formattedReviews = doc.reviewsData.map((review) => ({
        patientName: review.patientName || "Anonymous", // Use patientName from aggregation
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
        gender: doc.gender,
        qualification: doc.qualification,
        photo: doc.photo?.data
          ? {
            contentType: doc.photo.contentType,
            data: doc.photo.data.toString("base64"),
          }
          : null,
        reviews: {
          averageRating: doc.averageRating.toFixed(1),
          totalReviews: doc.totalReviews,
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

// Activate own doctor account
exports.activateDoctorAccount = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticated user

    // Find the doctor (only the authenticated user with role: "doctor")
    const doctor = await userModel.findOne({ _id: userId });
    if (!doctor) {
      return res.status(403).json({ success: false, message: "Not authorized. Doctor account required." });
    }

    // Check if already active
    if (doctor.isActive) {
      return res.status(400).json({ success: false, message: "Your account is already active" });
    }

    // Ensure the account is approved
    if (!doctor.isApproved) {
      return res.status(403).json({ success: false, message: "Cannot activate an unapproved account" });
    }

    // Activate the account
    doctor.isActive = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Your account has been activated successfully",
    });
  } catch (error) {
    console.error("Error activating doctor account:", error);
    res.status(500).json({
      success: false,
      message: "Error activating your account",
      error: error.message,
    });
  }
};

// Deactivate own doctor account
exports.deactivateDoctorAccount = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticated user

    // Find the doctor (only the authenticated user with role: "doctor")
    const doctor = await userModel.findOne({ _id: userId, role: "doctor" });
    if (!doctor) {
      return res.status(403).json({ success: false, message: "Not authorized. Doctor account required." });
    }

    // Check if already deactivated
    if (!doctor.isActive) {
      return res.status(400).json({ success: false, message: "Your account is already deactivated" });
    }

    // Deactivate the account
    doctor.isActive = false;
    await doctor.save();

    // Instruct frontend to log out
    res.status(200).json({
      success: true,
      message: "Your account has been deactivated successfully. Please log out.",
      logout: true, // Signal to frontend to clear auth and redirect
    });
  } catch (error) {
    console.error("Error deactivating doctor account:", error);
    res.status(500).json({
      success: false,
      message: "Error deactivating your account",
      error: error.message,
    });
  }
};