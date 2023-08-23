/**
 * Review Middleware
 */
const { body } = require('express-validator');

// Validation middleware for the review fields
const validateReviewFields = [
    body('comment').notEmpty().withMessage('comment is required').isString().withMessage('comment must be a string'),
    body('rating').notEmpty().withMessage('rating is required').isNumeric().withMessage('rating must be a number').isFloat({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
    body('images').optional().isArray().withMessage('images must be an array').custom((value) => {
      if (value && !value.every((item) => typeof item === 'string')) {
        throw new Error('images array should contain only strings');
      }
      return true;
    }),
  ];
  
  module.exports = {
    validateReviewFields,
  };