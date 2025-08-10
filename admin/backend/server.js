// admin/backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { PORT, MONGO_URI } = require('./config');

// Routes
const authRoutes = require('./routes/authRoutes');
const firRoutes = require('./routes/firRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Admin Backend: MongoDB Connected'))
    .catch(err => console.error('Admin Backend: MongoDB connection error:', err));

// Middlewares
app.use(cors()); // Allow requests from your admin frontend
app.use(express.json()); // Body parser for JSON

// Admin API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/firs', firRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('Admin Backend API is running...');
});

// Error handling middleware (optional, but good practice)
// This is a basic example; you might want a more sophisticated error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Admin Backend server running on port ${PORT}`);
});