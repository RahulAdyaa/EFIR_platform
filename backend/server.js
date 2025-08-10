const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const userRoutes = require('./routes/userRoutes');
const firRoutes = require('./routes/firRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002; // <--- CHANGE THE DEFAULT FALLBACK

// --- CORS Configuration ---
// Use the 'cors' middleware package. This should be one of the first middleware.
// It handles preflight OPTIONS requests automatically.
console.log(`CORS Middleware: Configuring with origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Your frontend URL
  credentials: true, // Important for sending cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly list allowed methods
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'] // Explicitly list allowed headers
}));

// --- Body Parsers ---
// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '10mb' }));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Request Logger ---
// Simple middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // Check if it's an OPTIONS request (preflight) and log if cors middleware handled it
  if (req.method === 'OPTIONS') {
    // The 'cors' middleware should handle this, so this log is just for confirmation
    // that an OPTIONS request was received before it hits your actual routes.
    // The 'cors' middleware will send the 204 response itself.
    console.log('OPTIONS request received and should be handled by cors middleware.');
  }
  next();
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/firs', firRoutes);

// --- Root Route ---
// A simple handler for the root URL
app.get('/', (req, res) => {
  res.status(200).send('API is running and accessible.');
});

// --- Global Error Handler ---
// Catches errors passed by next(err)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err); // Log the stack trace for more details
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.',
    // Only expose detailed error in development
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// --- Handle 404 Not Found for unhandled routes ---
// This should be after all your routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl} - Resource not found` });
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// --- Process-wide Unhandled Rejection and Exception Handling ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, close server gracefully and exit
  // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally, close server gracefully and exit
  // server.close(() => process.exit(1));
});