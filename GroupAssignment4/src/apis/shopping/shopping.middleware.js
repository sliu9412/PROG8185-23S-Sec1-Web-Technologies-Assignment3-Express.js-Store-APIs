/**
 * Shopping Middleware
 */
const { body, validationResult } = require('express-validator');

const validateShoppingCart = [
    body('productID').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('quantity').custom(value => !isNaN(value)).withMessage('Quantity must be a number'),

    // Handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateShoppingCart,
};
