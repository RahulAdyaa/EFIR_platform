// admin/backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        // You can add roles if you need different levels of admin access
        role: {
            type: String,
            enum: ['superadmin', 'editor', 'viewer'], // Example roles
            default: 'editor',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
     console.log(`[ADMIN MODEL] Hashing password for ${this.email}. Hashed: ${this.password.substring(0, 10)}...`); // Log hash
});

// Compare entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(`[ADMIN MODEL] Matching password for ${this.email}`);
    // DO NOT log the full enteredPassword or stored hash in production! For debugging only.
    // console.log(`  Entered: ${enteredPassword}`);
    // console.log(`  Stored Hash: ${this.password}`);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`[ADMIN MODEL] Password match result for ${this.email}: ${isMatch}`);
    return isMatch;
};


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;