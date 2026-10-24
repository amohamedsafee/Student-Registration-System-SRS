const express = require('express');
const registrationController = require('./registration.controller');
const requireAuth = require('../../core/middlewares/requireAuth');
const requireRole = require('../../core/middlewares/requireRole');
const validate = require('../../core/middlewares/validate');
const { validateRegistrationApply } = require('./registration.validator');
const { authLimiter } = require('../../core/middlewares/rateLimit');

const router = express.Router();

// 1. Public direct intake registration endpoint (rate-limited)
router.post(
  '/apply',
  authLimiter,
  validate(validateRegistrationApply),
  registrationController.apply
);

// 2. Authenticated student endpoints
router.post(
  '/',
  requireAuth,
  requireRole('student'),
  registrationController.applyAdditional
);

router.get(
  '/me',
  requireAuth,
  requireRole('student'),
  registrationController.getMyRegistrations
);

router.get(
  '/me/:id',
  requireAuth,
  requireRole('student'),
  registrationController.getMyRegistrationById
);

router.post(
  '/me/:id/cancel',
  requireAuth,
  requireRole('student'),
  registrationController.cancelMyRegistration
);

module.exports = router;
