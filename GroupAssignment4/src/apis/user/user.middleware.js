/**
 * User middlewares file.
 */
const { body, param, validationResult } = require('express-validator');

const validateCreate = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUserIDParam = [
  param('userID').notEmpty()
];

const validateUpdate = [
  ...validateCreate,
  ...validateUserIDParam
];

module.exports = {
    validateCreate,
    validateUpdate,
    validateUserIDParam
};