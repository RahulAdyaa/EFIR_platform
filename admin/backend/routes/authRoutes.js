// admin/backend/routes/authRoutes.js
const express = require('express');
const { authAdmin, registerAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', authAdmin);
router.post('/register', registerAdmin); // Should be restricted in production
router.get('/profile', protect, getAdminProfile);

module.exports = router;