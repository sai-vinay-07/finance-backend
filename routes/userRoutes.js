const express = require('express');
const { body, validationResult } = require('express-validator');
const { createUserByAdmin, getAllUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => err.msg)
        });
    }
    next();
};

const createUserValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role')
];

const updateRoleValidation = [
    body('role').isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role')
];

const updateStatusValidation = [
    body('isActive').isBoolean().withMessage('isActive must be a boolean')
];


router.post('/create', authMiddleware, roleMiddleware(['admin']), createUserValidation, handleValidationErrors, createUserByAdmin);


router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);


router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), updateRoleValidation, handleValidationErrors, updateUserRole);


router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), updateStatusValidation, handleValidationErrors, updateUserStatus);

module.exports = router;