const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // expect Bearer token format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // decode/verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // block inactive accounts
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account deactivated' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Auth failed:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

