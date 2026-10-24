const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { UnauthorizedError } = require('../errors/AppError');

function requireAuth(req, res, next) {
  try {
    // 1. Try reading token from HTTP-only cookie first, then Authorization Bearer header
    let token = req.cookies?.[config.jwt.cookieName];

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. No session found.');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, email, role, student_id? }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
