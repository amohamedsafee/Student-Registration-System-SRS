const { ForbiddenError, UnauthorizedError } = require('../errors/AppError');

/**
 * Middleware to restrict access to specific roles (e.g. 'admin')
 * @param {string|string[]} roles 
 */
function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`)
      );
    }

    next();
  };
}

module.exports = requireRole;
