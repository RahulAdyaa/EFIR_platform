// admin/backend/routes/analyticsRoutes.js
const express = require('express');
const { getFIRStats, getFIRTrend } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/fir-stats', protect, getFIRStats);
router.get('/fir-trend', protect, getFIRTrend);

module.exports = router;