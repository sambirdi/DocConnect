const bcrypt = require('bcryptjs');
const userModel = require('../models/User');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config();
const mongoose = require('mongoose');
const fs = require('fs');


// update profile
exports.updateDocProfileController = async (req, res) => {
    try {
        const { name, phone, practice, location, experience, institution, qualification, about } = req.fields;
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
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
        };

        if (photo) {
            updatedFields.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type,
            };
            // Clean up temp file
            fs.unlink(photo.path, (err) => err && console.error("Failed to delete temp file:", err));
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
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await userModel.findById(userId).select("photo");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.photo?.data) {
            return res.status(404).json({ success: false, message: "Photo not found" });
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

