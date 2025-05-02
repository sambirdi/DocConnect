const User = require('../models/User'); // Correct model import

const handleChatbotQuery = async (req, res) => {
  try {
    const { message, ocrText } = req.body;

    // Normalize input to lowercase and trim for consistent matching
    const input = (message || ocrText || '').toLowerCase().trim();

    // Handle OCR-extracted text or symptom-like text input (e.g., "fever")
    if (ocrText || input.includes('fever') || input.includes('headache') || input.includes('migraine') || input.includes('chest pain') || input.includes('heart') || input.includes('skin') || input.includes('rash')) {
      // Basic diagnosis logic based on keywords
      let practice = 'General Physician';
      if (input.includes('headache') || input.includes('migraine')) {
        practice = 'Neurologist';
      } else if (input.includes('chest pain') || input.includes('heart')) {
        practice = 'Cardiologist';
      } else if (input.includes('skin') || input.includes('rash')) {
        practice = 'Dermatologist';
      } else if (input.includes('fever')) {
        practice = 'General Physician';
      }

      // Find doctors by practice and role
      const doctors = await User.find({ practice, role: 'doctor', isApproved: true, isActive: true }).limit(3);
      if (doctors.length > 0) {
        return res.status(200).json({
          response: `Based on your ${ocrText ? 'report' : 'symptom'}, I suggest seeing a ${practice}.`,
          data: doctors.map(doc => ({
            name: doc.name,
            practice: doc.practice,
            location: doc.location,
            id: doc._id, // Use _id from MongoDB
          })),
        });
      } else {
        return res.status(200).json({
          response: 'No doctors found for this specialty. Try a General Practitioner.',
        });
      }
    }

    // Handle text queries
    if (input.includes('find doctor')) {
      const doctors = await User.find({ role: 'doctor', isApproved: true, isActive: true }).limit(4); // Match featured doctors logic
      return res.status(200).json({
        response: 'Here are some doctors:',
        data: doctors.map(doc => ({
          name: doc.name,
          practice: doc.practice,
          location: doc.location,
          id: doc._id,
        })),
      });
    } else if (input.includes('register') || input.includes('registration')) {
      return res.status(200).json({
        response: 'To register, go to /signup and verify your email with an OTP.',
      });
    } else {
      return res.status(200).json({
        response: 'I can help you find doctors, register, or analyze a medical report. Try asking or upload a report!',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Chatbot error' });
  }
};

module.exports = { handleChatbotQuery };