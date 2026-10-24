const { AppError } = require('../errors/AppError');
const config = require('../../config/config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected internal error occurred';
  let details = err.details || undefined;

  // Handle MySQL duplicate key error (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'A record with this identifier or unique attribute already exists.';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Authentication token is invalid or malformed.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication session has expired. Please log in again.';
  }

  // Hide 500 error internal stack traces in production
  if (!config.isProduction && statusCode === 500) {
    console.error('[UNHANDLED ERROR]', err);
  }

  const responseBody = {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(!config.isProduction && statusCode === 500 ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
