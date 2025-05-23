const express = require('express');
const router = express.Router();
const { handleChatbotQuery } = require('../controllers/chatbotController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/chatbot', upload.single('report'), handleChatbotQuery);

module.exports = router;