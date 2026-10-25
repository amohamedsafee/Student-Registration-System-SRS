const authService = require('./auth.service');
const config = require('../../config/config');

class AuthController {
  /**
   * Helper to set HTTP-only JWT cookie
   */
  setTokenCookie(res, token) {
    const isProduction = config.isProduction;
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    };

    res.cookie(config.jwt.cookieName, token, cookieOptions);
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);

      // Attach HTTP-only cookie
      this.setTokenCookie(res, token);

      res.json({
        message: 'Login successful',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      res.clearCookie(config.jwt.cookieName, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: config.isProduction ? 'strict' : 'lax',
        path: '/',
      });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(req, res, next) {
    try {
      const result = await authService.sendVerification(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

// Bind methods to maintain `this`
const controller = new AuthController();
controller.login = controller.login.bind(controller);
controller.logout = controller.logout.bind(controller);
controller.me = controller.me.bind(controller);
controller.verifyEmail = controller.verifyEmail.bind(controller);
controller.resendVerification = controller.resendVerification.bind(controller);
controller.forgotPassword = controller.forgotPassword.bind(controller);
controller.resetPassword = controller.resetPassword.bind(controller);

module.exports = controller;
