/**
 * Base Application Error Class
 * All custom errors extend from this
 * 
 * Design by Contract: Every error has a status code and message
*/

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true // Operational errors as opposed to programming errors

        Error.captureStackTrace(this, this.constructor);
    }
}

// 404 - Not Found Error
class NotFoundError extends AppError {
    constructor(resource, id = null){
        const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
        super(message, 404);
    }
}

// 400 - Bad Request Error (validation failures)
class ValidationError extends AppError {
    constructor(message, errors = []){
        super(message, 400);
        this.errors = errors;
    }
}

// 409 - Conflict Error (business rule violations)
class ConflictError extends AppError {
    constructor(message){
        super(message, 409);
    }
}

// 401 - Unauthorized Error
class UnauthorizedError extends AppError{
    constructor(message = 'Unauthorized Access'){
        super(message, 401);
    }
}

// 403 - Forbidden Error
class ForbiddenError extends AppError {
    constructor(message = 'Access Forbidden'){
        super(message, 403);
    }
}


module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    ConflictError,
    UnauthorizedError, 
    ForbiddenError
};