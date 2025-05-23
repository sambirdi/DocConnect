const User = require('../models/User');
const mongoose = require('mongoose');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { agentBuilder } = require('../agent/doctorSearchAgent');
const Tesseract = require('tesseract.js');

// Initialize Gemini
const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

// Website-related query responses (fallback)
const websiteInfo = {
  'about website': 'DocConnect helps you find trusted doctors by symptoms, specialization, or location. Features include AI-powered doctor recommendations, verified doctor profiles, and patient reviews. Navigate to /search-results for doctor search, /signup to register, or /about for more details.',
  'how to use': 'To use DocConnect, search for doctors by entering symptoms or location in the homepage search bar, browse specialties, or use me to find doctors based on symptoms. Register at /signup to book appointments. Upload a medical report here for diagnosis suggestions.',
  'signup': 'To register, go to /signup, enter your details, and verify your email with an OTP. Once registered, you can book appointments and access personalized doctor recommendations.',
  'find doctor': 'You can find doctors by typing symptoms (e.g., "fever"), searching by specialty (e.g., "Cardiologist") on the homepage, or browsing our featured doctors. I can also recommend doctors based on symptoms or medical reports!',
  'what can you do': 'I can help you find doctors based on symptoms, specialties, or medical reports, learn about the DocConnect website, or analyze uploaded medical reports. Try saying "I have a fever," "Gynecologist," "about website," or upload a report.',
};

// Condition-specific guidance with action lists
const conditionGuidance = {
  pneumonia: {
    advice: 'Pneumonia is a serious lung infection. Seek medical attention promptly.',
    specialty: 'Pulmonologist',
    actions: [
      'Rest and stay hydrated',
      'Avoid spreading infection by covering your mouth during coughs',
    ],
  },
  migraine: {
    advice: 'Migraines can be debilitating. Avoid triggers like bright lights or stress.',
    specialty: 'Neurologist',
    actions: [
      'Rest in a quiet, dark room',
      'Stay hydrated and avoid known triggers',
    ],
  },
  dermatitis: {
    advice: 'A rash may indicate dermatitis or an allergic reaction.',
    specialty: 'Dermatologist',
    actions: [
      'Avoid scratching and use mild soaps',
      'Apply moisturizers to soothe the skin',
    ],
  },
  angina: {
    advice: 'Chest pain may indicate a heart condition. Seek medical attention immediately.',
    specialty: 'Cardiologist',
    actions: [
      'Avoid strenuous activity',
      'Seek immediate medical attention',
    ],
  },
  gastroenteritis: {
    advice: 'Stomach pain and vomiting may indicate gastroenteritis.',
    specialty: 'Gastroenterologist',
    actions: [
      'Stay hydrated with small sips of water',
      'Avoid solid food temporarily',
    ],
  },
};

// Tips for staying healthy (used when no condition is detected)
const healthyTips = [
  'Maintain a balanced diet',
  'Exercise regularly',
];

// Analyze input with Gemini
const analyzeWithGemini = async (input, isMedical = false) => {
  try {
    const systemPrompt = isMedical
      ? `You are HealthBot for DocConnect, a platform to find doctors. Analyze the user's symptoms or medical report: "${input}". Provide a possible diagnosis and the appropriate doctor specialty. Available specialties include: Cardiologist, Neurologist, Dermatologist, Gynecologist, Dentist, Ophthalmologist, Pulmonologist, Orthopedist, General Physician, General Practitioner, Obstetrician/Gynecologist, Gastroenterologist, Internal Medicine. If the symptom doesn't clearly match a specialty, recommend General Physician and explain why. Do not ask for additional details like duration, frequency, or location; focus on providing a diagnosis and specialty. For symptoms like cough, fever, and shortness of breath, consider pneumonia as a possible diagnosis and recommend a Pulmonologist. Format response as: Diagnosis: [text]. Specialty: [text]. Do not provide definitive medical advice; encourage consulting a doctor.`
      : `You are HealthBot for DocConnect. For website-related queries (e.g., "about website"), describe DocConnect's features: finding doctors by symptoms, verified profiles, and report analysis. For generic queries (e.g., "hi," "what can you do") or unrecognized inputs, respond: "I can help you find doctors based on symptoms or specialties, learn about the DocConnect website, or analyze medical reports. Try saying 'I have a fever,' 'Gynecologist,' 'about website,' or upload a medical report." If the input seems symptom-related (e.g., contains "pain," "ache," "feel"), suggest trying the symptom again. Do not ask for additional details; provide a direct response. Input: "${input}".`;

    const response = await llm.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input },
    ]);

    if (isMedical) {
      const result = response.content;
      const diagnosisMatch = result.match(/Diagnosis: (.+?)\. Specialty: (.+)/i);
      return {
        diagnosis: diagnosisMatch ? diagnosisMatch[1] : 'Consult a doctor for accurate diagnosis.',
        specialty: diagnosisMatch ? diagnosisMatch[2] : 'General Physician',
      };
    }
    return response.content;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return isMedical
      ? {
        diagnosis: 'Consult a doctor for accurate diagnosis.',
        specialty: 'General Physician'
      }
      : 'I can help with symptoms (e.g., "fever"), specialties (e.g., "Gynecologist"), website info (e.g., "about website"), or medical report analysis. What do you need?';
  }
};

// Perform OCR on uploaded image
const performOCR = async (file) => {
  try {
    const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng');
    return text.trim();
  } catch (error) {
    console.error('OCR error:', error.message);
    return '';
  }
};

// Handle chatbot query
const handleChatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    let ocrText = req.body.ocrText || '';

    // Handle file upload for OCR
    if (req.file) {
      ocrText = await performOCR(req.file);
    }

    const input = (message || ocrText || '').toLowerCase().trim();
    if (!input) {
      return res.status(200).json({
        response: 'Please provide a symptom, specialty, question about the website, or upload a medical report.',
      });
    }

    // Handle OCR input
    if (req.file && ocrText) {
      // Scan OCR text for known conditions
      let matchedCondition = null;
      for (const condition in conditionGuidance) {
        if (ocrText.toLowerCase().includes(condition)) {
          matchedCondition = condition;
          break;
        }
      }

      if (matchedCondition) {
        const { advice, specialty, actions } = conditionGuidance[matchedCondition];

        // Fetch top 3 doctors for the specialty (e.g., Pulmonologist for pneumonia)
        let matchingDoctors = await User.find({
          practice: { $regex: new RegExp(`^${specialty}$`, 'i') },
          role: 'doctor',
          isApproved: true,
          isActive: true,
        })
          .select('name practice location rating')
          .sort({ rating: -1 })
          .limit(3);

        // If no doctors found for the specialty, fall back to General Physician
        let fallbackUsed = false;
        if (matchingDoctors.length === 0 && specialty !== 'General Physician') {
          matchingDoctors = await User.find({
            practice: { $regex: new RegExp(`^General Physician$`, 'i') },
            role: 'doctor',
            isApproved: true,
            isActive: true,
          })
            .select('name practice location rating')
            .sort({ rating: -1 })
            .limit(3);
          fallbackUsed = true;
        }

        // Format response for non-healthy case
        let response = `Based on your report: ${matchedCondition.charAt(0).toUpperCase() + matchedCondition.slice(1)}\n${advice}\n\nWhat you can do:\n`;
        actions.forEach(action => {
          response += `- ${action}\n`;
        });
        response += '\nSuggested doctors:\n';
        if (matchingDoctors.length > 0) {
          matchingDoctors.forEach(doc => {
            response += `- ${doc.name || 'Doctor'}\n`;
          });
        } else {
          response += `- No doctors found. Try searching for a ${specialty} or General Physician on the homepage.\n`;
        }

        return res.status(200).json({
          response,
          data: matchingDoctors.length > 0 ? matchingDoctors.map(doc => ({
            name: doc.name || 'Doctor',
            practice: doc.practice || (fallbackUsed ? 'General Physician' : specialty),
            location: doc.location || 'Unknown Location',
            id: doc._id,
            rating: doc.rating || 0,
          })) : [],
        });
      } else {
        // Healthy case
        let response = `Based on your report: Healthy\n\nNo known disease detected in the report. You appear to be healthy. Please consult a doctor if you feel unwell.\n\nTips to stay healthy:\n\n`;
        healthyTips.forEach(tip => {
          response += `- ${tip}\n`;
        });
        response += '\nNo need to see the doctor at this time. Please consult a doctor if you feel unwell.';

        return res.status(200).json({
          response,
        });
      }
    }

    // Handle symptom-like input
    if (input.includes('pain') || input.includes('ache') || input.includes('symptom') || input.includes('feel') || input.includes('have') || input.match(/\b(fever|cough|rash|headache|migraine|chest|sore|back|skin|heart|tooth|eye|period|bleeding|discharge|irregular periods|menstrual|dizziness|vertigo|nausea|stomachache|stomach|abdominal|shortness of breath)\b/i)) {
      const geminiResult = await analyzeWithGemini(input, true);
      let practice = geminiResult.specialty;
      const diagnosis = geminiResult.diagnosis;

      // Normalize specialty to handle synonyms
      const specialtyMap = {
        'general practitioner': 'General Physician',
        'obstetrician/gynecologist': 'Gynecologist',
        'neurology': 'Neurologist',
        'internal medicine': 'General Physician',
      };
      practice = specialtyMap[practice.toLowerCase()] || practice;

      // Check for specific conditions like pneumonia
      let advice = 'AI-generated diagnoses are not a substitute for professional medical advice. Consult a doctor for proper diagnosis and treatment.';
      if (diagnosis.toLowerCase().includes('pneumonia')) {
        advice = conditionGuidance.pneumonia.advice;
        practice = conditionGuidance.pneumonia.specialty; // Ensure Pulmonologist for pneumonia
      }

      // Use agentBuilder to find doctor IDs
      const messages = [{ role: 'user', content: input }];
      let agentResult;
      try {
        agentResult = await agentBuilder.invoke({ messages });
      } catch (error) {
        agentResult = { messages: [] };
      }

      let doctorIds = [];
      if (agentResult.messages && agentResult.messages.length > 0) {
        const response = agentResult.messages[agentResult.messages.length - 1].content;
        try {
          const cleanedResponse = response
            .replace(/^```json\n?/, '')
            .replace(/\n?```/, '')
            .replace(/^\s*[\{\[]\s*/, '')
            .replace(/\s*[\]\}]\s*$/, '')
            .trim();
          doctorIds = JSON.parse(`[${cleanedResponse}]`);
          doctorIds = doctorIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        } catch (error) {
          doctorIds = [];
        }
      }

      // Fetch doctor details, sorted by rating
      let matchingDoctors = [];
      if (doctorIds.length > 0) {
        matchingDoctors = await User.find({
          _id: { $in: doctorIds.map(id => new mongoose.Types.ObjectId(id)) },
          role: 'doctor',
          isApproved: true,
          isActive: true,
        })
          .select('name practice location rating')
          .sort({ rating: -1 })
          .limit(3);
      }

      // Fallback to direct query if no doctors found via agentBuilder
      if (matchingDoctors.length === 0) {
        matchingDoctors = await User.find({
          practice: { $regex: new RegExp(`^${practice}$`, 'i') },
          role: 'doctor',
          isApproved: true,
          isActive: true,
        })
          .select('name practice location rating')
          .sort({ rating: -1 })
          .limit(3);
      }

      if (matchingDoctors.length > 0) {
        return res.status(200).json({
          response: `Based on your symptoms, ${diagnosis}. ${advice}`,
          data: matchingDoctors.map(doc => ({
            name: doc.name || 'Doctor',
            practice: doc.practice || practice,
            location: doc.location || 'Unknown Location',
            id: doc._id,
            rating: doc.rating || 0,
          })),
        });
      } else {
        return res.status(200).json({
          response: `No ${practice} found. ${diagnosis}. ${advice}`,
        });
      }
    }

    // Handle website-related queries
    const websiteQueryVariants = {
      'about website': 'about website',
      'tell about the website': 'about website',
      'website info': 'about website',
      'what is the website': 'about website',
      'what can you do': 'what can you do',
    };
    for (const [variant, key] of Object.entries(websiteQueryVariants)) {
      if (input.includes(variant)) {
        const fallbackResponse = websiteInfo[key];
        const geminiResult = await analyzeWithGemini(input);
        return res.status(200).json({ response: geminiResult || fallbackResponse });
      }
    }

    // Handle doctor search by specialty
    const specialtyMatch = input.match(/(cardiologist|neurologist|dermatologist|gynecologist|dentist|ophthalmologist|pulmonologist|orthopedist|general physician|general practitioner|obstetrician\/gynecologist|gastroenterologist|internal medicine)/i);
    if (specialtyMatch || input.includes('find doctor') || input.includes('doctor')) {
      let practice = specialtyMatch ? specialtyMatch[1].replace(/general physician|general practitioner|obstetrician\/gynecologist|internal medicine/i, 'General Physician') : null;

      if (!practice) {
        const geminiResult = await analyzeWithGemini(input, true);
        practice = geminiResult.specialty;
        const specialtyMap = {
          'general practitioner': 'General Physician',
          'obstetrician/gynecologist': 'Gynecologist',
          'neurology': 'Neurologist',
          'internal medicine': 'General Physician',
        };
        practice = specialtyMap[practice.toLowerCase()] || practice;
      }

      // Use agentBuilder to find doctor IDs
      const messages = [{ role: 'user', content: practice }];
      let agentResult;
      try {
        agentResult = await agentBuilder.invoke({ messages });
      } catch (error) {
        agentResult = { messages: [] };
      }

      let doctorIds = [];
      if (agentResult.messages && agentResult.messages.length > 0) {
        const response = agentResult.messages[agentResult.messages.length - 1].content;
        try {
          const cleanedResponse = response
            .replace(/^```json\n?/, '')
            .replace(/\n?```/, '')
            .replace(/^\s*[\{\[]\s*/, '')
            .replace(/\s*[\]\}]\s*$/, '')
            .trim();
          doctorIds = JSON.parse(`[${cleanedResponse}]`);
          doctorIds = doctorIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        } catch (error) {
          doctorIds = [];
        }
      }

      // Fetch doctor details, sorted by rating
      let matchingDoctors = [];
      if (doctorIds.length > 0) {
        matchingDoctors = await User.find({
          _id: { $in: doctorIds.map(id => new mongoose.Types.ObjectId(id)) },
          role: 'doctor',
          isApproved: true,
          isActive: true,
        })
          .select('name practice location rating')
          .sort({ rating: -1 })
          .limit(4);
      }

      // Fallback to direct query if no doctors found via agentBuilder
      if (matchingDoctors.length === 0) {
        matchingDoctors = await User.find({
          practice: { $regex: new RegExp(`^${practice}$`, 'i') },
          role: 'doctor',
          isApproved: true,
          isActive: true,
        })
          .select('name practice location rating')
          .sort({ rating: -1 })
          .limit(4);
      }

      if (matchingDoctors.length > 0) {
        return res.status(200).json({
          response: `Here are some ${practice}s:`,
          data: matchingDoctors.map(doc => ({
            name: doc.name || 'Doctor',
            practice: doc.practice || practice,
            location: doc.location || 'Unknown Location',
            id: doc._id,
            rating: doc.rating || 0,
          })),
        });
      } else {
        return res.status(200).json({
          response: `No ${practice}s found. Try searching on the homepage.`,
        });
      }
    }

    // Default response
    const geminiResult = await analyzeWithGemini(input);
    return res.status(200).json({
      response: geminiResult,
    });
  } catch (error) {
    console.error('Chatbot controller error:', error.message, error.stack);
    return res.status(500).json({ error: 'Chatbot error' });
  }
};

module.exports = { handleChatbotQuery };