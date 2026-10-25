class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details = null) {
    super(message, 400, code, details);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null, code = 'VALIDATION_ERROR') {
    super(message, 400, code, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', code = 'UNAUTHORIZED', details = null) {
    super(message, 401, code, details);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden resource', code = 'FORBIDDEN', details = null) {
    super(message, 403, code, details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details = null) {
    super(message, 404, code, details);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict occurred', code = 'CONFLICT', details = null) {
    super(message, 409, code, details);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later', code = 'RATE_LIMIT_EXCEEDED') {
    super(message, 429, code);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
};
