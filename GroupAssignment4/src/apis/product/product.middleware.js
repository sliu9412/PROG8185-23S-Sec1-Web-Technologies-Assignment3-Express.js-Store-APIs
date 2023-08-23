/**
 * Product Middleware
 */
const { body, param, validationResult } = require('express-validator');

// Middleware function to validate the request body for "Product" data
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image path is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('shippingCost').isFloat({ min: 0 }).withMessage('Shipping cost must be a positive number'),

  // Custom sanitizer to trim spaces from name and description
  body('name').trim(),
  body('description').trim(),

  // Custom validation to check that price and shippingCost are numbers
  body('price').custom(value => !isNaN(value)).withMessage('Price must be a number'),
  body('shippingCost').custom(value => !isNaN(value)).withMessage('Shipping cost must be a number'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateProductIDParam = [
  param('productID').notEmpty()
];

const validateUpdateProduct = [
  ...validateProduct,
  ...validateProductIDParam,
];

module.exports = {
    validateProduct,
    validateProductIDParam,
    validateUpdateProduct,
};
