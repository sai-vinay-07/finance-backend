// check if user role allows access
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied wrong role' });
        }
    };
};

module.exports = roleMiddleware;

