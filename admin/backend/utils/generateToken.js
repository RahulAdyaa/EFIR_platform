// admin/backend/utils/generateToken.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

module.exports = generateToken;