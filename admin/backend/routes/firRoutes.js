// admin/backend/routes/firRoutes.js
const express = require('express');
const { getAllFIRs, getFIRById, updateFIRStatus } = require('../controllers/firController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getAllFIRs);
router.get('/:id', protect, getFIRById);
router.put('/:id/status', protect, updateFIRStatus);

module.exports = router;