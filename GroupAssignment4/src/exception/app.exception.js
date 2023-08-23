/**
 * Business Exception
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    withOriginalStack(originalError) {
        this.stack = `${this.stack}\n--- Original Stack ---\n${originalError.stack}`;
        return this;
    }
}

module.exports = AppError;
