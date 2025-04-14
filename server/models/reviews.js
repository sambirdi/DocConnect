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


module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
