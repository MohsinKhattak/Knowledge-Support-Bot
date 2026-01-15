const { verifyToken } = require('../utils/tokenHelper');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
};

const premiumUserOnly = (req, res, next) => {
    if (req.user.role !== 'premium_user') {
        return res.status(403).json({
            success: false,
            message: 'Only premium users can access this resource',
        });
    }
    next();
};

module.exports = { authenticate, premiumUserOnly };
