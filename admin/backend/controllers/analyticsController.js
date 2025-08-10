// admin/backend/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const FIR = require('../models/FIR'); // Use the shared FIR model

// @desc    Get FIR statistics for analytics
// @route   GET /api/admin/analytics/fir-stats
// @access  Private (Admin only)
const getFIRStats = asyncHandler(async (req, res) => {
    const totalFIRs = await FIR.countDocuments({});
    const resolvedFIRs = await FIR.countDocuments({ status: 'Resolved' });
    const dismissedFIRs = await FIR.countDocuments({ status: 'Dismissed' });
    const underProcessFIRs = await FIR.countDocuments({ status: 'Under Process' });

    res.json({
        total: totalFIRs,
        resolved: resolvedFIRs,
        dismissed: dismissedFIRs,
        underProcess: underProcessFIRs,
    });
});

// @desc    Get FIRs created over time (e.g., daily, monthly)
// @route   GET /api/admin/analytics/fir-trend
// @access  Private (Admin only)
const getFIRTrend = asyncHandler(async (req, res) => {
    // This is a basic example; you might want more sophisticated aggregation
    const firsByMonth = await FIR.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 },
        },
    ]);

    res.json(firsByMonth);
});

module.exports = {
    getFIRStats,
    getFIRTrend,
};