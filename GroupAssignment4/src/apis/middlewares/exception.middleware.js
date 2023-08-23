/**
 * Global Exception Middleware
 */
const AppError = require('../../exception/app.exception');

function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    console.error('APP global error handler: ', err);
    res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;