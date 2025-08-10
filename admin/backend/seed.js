// admin/backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Make sure you have 'dotenv' installed (npm install dotenv)
const Admin = require('./models/Admin'); // Path to your Admin model
const { MONGO_URI } = require('./config'); // Path to your backend config file

// Load environment variables
// Adjust path to your .env file if it's in the project root
// If your .env is inside admin/backend, you might just use `dotenv.config();`
// If it's at the project root (e.g., C:\Users\Asus\Desktop\EFIRManagement portal\.env)
dotenv.config({ path: '../../.env' }); // Adjust this path if your .env is elsewhere

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected for seeding'))
    .catch(err => console.error('MongoDB connection error during seeding:', err));

// --- Function to import data (create admin user) ---
const importData = async () => {
    try {
        // !!! CAUTION: This will delete ALL existing documents in the 'admins' collection !!!
        // This is useful for development to start fresh, but be careful in production scenarios.
        await Admin.deleteMany();
        console.log('Existing admin users cleared from database.');

        // Define the admin user you want to create
        const adminUser = await Admin.create({
            name: 'Ana Admin', // You can change this name
            email: 'ana@government.gov.in', // <--- IMPORTANT: Use this email for login
            password: 'testpassword123', // <--- IMPORTANT: Use this password for login (will be hashed)
            role: 'superadmin' // Set desired role
        });

        console.log(`Admin user '${adminUser.email}' created successfully!`);
        process.exit(); // Exit the process after successful seeding
    } catch (error) {
        console.error('Error with data import (seeding):', error);
        process.exit(1); // Exit with an error code
    }
};

// --- Function to destroy data (delete all admin users) ---
const destroyData = async () => {
    try {
        await Admin.deleteMany();
        console.log('All admin data destroyed from database!');
        process.exit();
    } catch (error) {
        console.error('Error with data destroy:', error);
        process.exit(1);
    }
};

// --- Command line argument check to decide action ---
// To run: node seed.js
// To run: node seed.js -d (to destroy data)
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}