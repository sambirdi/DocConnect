const express = require('express');
const router = express.Router();
const { handleChatbotQuery } = require('../controllers/chatbotController');

router.post('/chatbot', handleChatbotQuery);

module.exports = router;