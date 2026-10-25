const rateLimit = require('express-rate-limit');
const { TooManyRequestsError } = require('../errors/AppError');

// Rate limiter for general public API endpoints (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many requests from this IP, please try again in 15 minutes.'));
  },
});

// Stricter rate limiter for authentication & registration endpoints (10 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts, please try again in 15 minutes.'));
  },
});

// Rate limiter for registration submission (5 requests per 10 minutes per IP)
const registrationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many registration attempts from this IP, please try again later.'));
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  registrationLimiter,
};
