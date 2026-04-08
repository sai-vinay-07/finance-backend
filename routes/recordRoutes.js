const express = require('express');
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { body, validationResult } = require('express-validator');

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

const recordValidation = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a number greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date')
];


router.get('/', authMiddleware, roleMiddleware(['viewer', 'analyst', 'admin']), getRecords);


router.post('/', authMiddleware, roleMiddleware(['analyst', 'admin']), handleValidationErrors, createRecord);


router.put('/:id', authMiddleware, roleMiddleware(['admin']), recordValidation, handleValidationErrors, updateRecord);


router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteRecord);

module.exports = router;