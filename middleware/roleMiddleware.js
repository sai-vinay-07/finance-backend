

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
    };
};

module.exports = roleMiddleware;