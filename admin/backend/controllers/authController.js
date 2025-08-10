// admin/backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { ADMIN_EMAIL_DOMAIN } = require('../config');

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(`[LOGIN ATTEMPT] Email: ${email}, Password: ${password}`); // Log received credentials

    const admin = await Admin.findOne({ email });

    if (!admin) {
        console.log(`[LOGIN FAILED] Admin not found for email: ${email}`); // Log if admin not found
        res.status(401);
        throw new Error('Invalid email or password');
    }

    console.log(`[LOGIN SUCCESS] Admin found: ${admin.email}`); // Log if admin found
    console.log(`[PASSWORD CHECK] Comparing provided password with stored hash...`); // Log before password check

    if (await admin.matchPassword(password)) {
        console.log(`[LOGIN SUCCESS] Password matched for: ${admin.email}`); // Log if password matched
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
            role: admin.role,
        });
    } else {
        console.log(`[LOGIN FAILED] Password mismatch for email: ${admin.email}`); // Log if password mismatch
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new admin (for initial setup or superadmin only)
// @route   POST /api/admin/auth/register
// @access  Public (should be restricted in production)
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
     const requiredDomain = ADMIN_EMAIL_DOMAIN ? `@${ADMIN_EMAIL_DOMAIN}` : '';

    // Optional: Restrict registration to specific email domains
    // Use 'requiredDomain' for the check to ensure '@' is included
    if (requiredDomain && !email.endsWith(requiredDomain)) { // <-- FIX IS HERE
        res.status(400);
        throw new Error(`Only government employees with email ending in ${requiredDomain} can register.`);
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
            role: admin.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc    Get admin profile
// @route   GET /api/admin/auth/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
    const admin = {
        _id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
    };
    res.json(admin);
});

module.exports = {
    authAdmin,
    registerAdmin,
    getAdminProfile,
};