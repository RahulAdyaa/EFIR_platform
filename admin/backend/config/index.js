// admin/backend/config/index.js
require('dotenv').config();

module.exports = {
    PORT: process.env.ADMIN_BACKEND_PORT || 5002, // Admin backend will run on a different port
    MONGO_URI: process.env.MONGO_URI, // Use the same MongoDB URI as your main backend
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey', // CHANGE THIS IN PRODUCTION
    ADMIN_EMAIL_DOMAIN: process.env.ADMIN_EMAIL_DOMAIN || '@government.gov.in', // Example for restricting admin emails
};