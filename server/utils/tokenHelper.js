const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '24h') => {
    try {
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn }
        );
        return token;
    } catch (error) {
        throw new Error('Token generation failed');
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        throw new Error('Token verification failed');
    }
};

module.exports = { generateToken, verifyToken };
