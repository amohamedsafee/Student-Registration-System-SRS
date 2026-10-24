const express = require('express');
const authController = require('./auth.controller');
const requireAuth = require('../../core/middlewares/requireAuth');
const { authLimiter } = require('../../core/middlewares/rateLimit');

const router = express.Router();

// Apply auth rate limiting to sensitive public auth endpoints
router.use('/login', authLimiter);
router.use('/forgot-password', authLimiter);
router.use('/reset-password', authLimiter);

// Public Auth Endpoints
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Authenticated Endpoints
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/resend-verification', requireAuth, authController.resendVerification);

module.exports = router;
