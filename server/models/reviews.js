const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  reviewText: { 
    type: String, 
    trim: true 
  },
}, { timestamps: true });

// Add indexes
reviewSchema.index({ doctorId: 1, createdAt: -1 });
reviewSchema.index({ patientId: 1 });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
