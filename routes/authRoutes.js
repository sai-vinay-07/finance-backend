const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const {registerUser,loginUser} = require('../controllers/authController')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg)
    })
  }
  next()
}

router.post('/register', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], handleValidationErrors, registerUser)

router.post('/login', [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, loginUser)

module.exports = router