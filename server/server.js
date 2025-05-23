const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes')
const docNotiRoute = require('./routes/docNotiRoutes');
const chatbotRoute = require('./routes/chatbotRoute');
const flaggedReviewRoutes = require('./routes/flaggedReviewRoutes');
require('./cron/cleanupNotifications');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to Node.js');
});

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doc-notification', docNotiRoute);
app.use('/api/chatbot',chatbotRoute);
console.log('Type of flaggedReviewRoutes:', typeof flaggedReviewRoutes);
console.log('flaggedReviewRoutes contents:', flaggedReviewRoutes);
app.use('/api/reviews', flaggedReviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});