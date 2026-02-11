/**
 * Error Handler Middleware 
 * Centralized error handling for all routes
 * 
 * Must be registered LAST in middleware chain (after all routes)
*/

const {} = require('../../../domain/errors/AppError');

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Express next function
 * 
*/

function errorHandler(err, req, res, next) {
    // Log error for debugging (in production, use proper logger like Winston)
    console.error('Error occurred:', {
        message: err.message,
        statusCode: err.statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });

    // Handle operational errors (errors we expect)
    if (err.isOperational || err.operational) {
        // ValidationError with multiple error messages
        if (err.errors && Array.isArray(err.errors)) {
            return res.status(err.statusCode).json({
                error: {
                    message: err.message,
                    statusCode: err.statusCode,
                    errors: err.errors,
                    timestamp: new Date().toISOString(),
                    path: req.path
                }
            });
        }

        // Other operational errors (NotFoundError, ConflictError, etc.)
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                statusCode: err.statusCode,
                timestamp: new Date().toISOString(),
                path: req.path
            }
        });
    }

    // Handle unexpected errors (programming errors)
    // Don't leak error details to client in production
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error';

    res.status(statusCode).json({
        error: {
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            path: req.path,
            // Only include stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 * 
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    errorHandler,
    asyncHandler
};