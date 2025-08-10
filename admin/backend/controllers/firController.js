// admin/backend/controllers/firController.js
const asyncHandler = require('express-async-handler');
const FIR = require('../models/FIR'); // Use the shared FIR model

// @desc    Get all FIRs
// @route   GET /api/admin/firs
// @access  Private (Admin only)
const getAllFIRs = asyncHandler(async (req, res) => {
    const firs = await FIR.find({}).sort({ createdAt: -1 }); // Get latest FIRs first
    res.json(firs);
});

// @desc    Get single FIR by ID
// @route   GET /api/admin/firs/:id
// @access  Private (Admin only)
const getFIRById = asyncHandler(async (req, res) => {
    const fir = await FIR.findById(req.params.id);

    if (fir) {
        res.json(fir);
    } else {
        res.status(404);
        throw new Error('FIR not found');
    }
});

// @desc    Update FIR status
// @route   PUT /api/admin/firs/:id/status
// @access  Private (Admin only)
const updateFIRStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // Expect status: 'Resolved', 'Dismissed', 'Under Process'

    const fir = await FIR.findById(req.params.id);

    if (fir) {
        fir.status = status;
        fir.updatedAt = Date.now(); // Update the updatedAt field

        // Optional: Add a comment field for admin updates
        // fir.adminComment = req.body.adminComment || fir.adminComment;

        const updatedFIR = await fir.save();
        res.json({
            message: 'FIR status updated successfully',
            fir: updatedFIR,
        });
    } else {
        res.status(404);
        throw new Error('FIR not found');
    }
});

module.exports = {
    getAllFIRs,
    getFIRById,
    updateFIRStatus,
};