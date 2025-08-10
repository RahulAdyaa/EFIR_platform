// admin/backend/models/FIR.js
// This file assumes your main backend has a FIR model at backend/models/FIR.js
// We are simply requiring it here to use the same schema.

const mongoose = require('mongoose');

// Adjust this path based on your actual project structure
// Assuming your main backend is parallel to 'admin' folder
const FIRSchema = require('../../../backend/models/Firnum').schema; // Adjust path as needed

const FIR = mongoose.model('FIR', FIRSchema);

module.exports = FIR;