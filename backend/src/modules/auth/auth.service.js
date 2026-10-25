const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const authModel = require('./auth.model');
const emailService = require('../../third-party/email.service');
const { generateRandomToken, hashToken } = require('../../core/utils/tokenHelper');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require('../../core/errors/AppError');

class AuthService {
  /**
   * Authenticate user with email and password
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required', 'MISSING_CREDENTIALS');
    }

    // 1. Fetch user by email
    const user = await authModel.findByEmail(email);

    // 2. Generic auth failure to prevent enumeration
    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // 3. Verify password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // 4. Check if account is active
    if (!user.is_active) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.', 'ACCOUNT_DEACTIVATED');
    }

    // 5. Update last login timestamp
    await authModel.updateLastLogin(user.id);

    // 6. Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      student_id: user.student_id || null,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      student_id: user.student_id || null,
      full_name: user.full_name || null,
      email_verified: Boolean(user.email_verified_at),
      last_login_at: user.last_login_at,
    };

    return { token, user: sanitizedUser };
  }

  /**
   * Get current authenticated user details
   * @param {string} userId 
   */
  async getCurrentUser(userId) {
    const user = await authModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      whatsapp_number: user.whatsapp_number,
      home_address: user.home_address,
      email_verified: Boolean(user.email_verified_at),
      created_at: user.created_at,
    };
  }

  /**
   * Initiate email verification flow for a user
   * @param {string} userId 
   */
  async sendVerification(userId) {
    const user = await authModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.email_verified_at) {
      return { message: 'Email is already verified' };
    }

    // Generate token & hash
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await authModel.createVerificationToken(user.id, tokenHash, expiresAt);

    // Send email
    await emailService.sendVerificationEmail(user.email, rawToken, user.full_name || 'Student');

    return { message: 'Verification email sent successfully' };
  }

  /**
   * Verify email using raw token from email link
   * @param {string} rawToken 
   */
  async verifyEmail(rawToken) {
    if (!rawToken) {
      throw new BadRequestError('Verification token is required', 'MISSING_TOKEN');
    }

    const tokenHash = hashToken(rawToken);
    const tokenRecord = await authModel.findVerificationToken(tokenHash);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired verification token', 'INVALID_TOKEN');
    }

    // Mark token used and user verified
    await authModel.markVerificationTokenUsed(tokenRecord.id);
    await authModel.markEmailVerified(tokenRecord.user_id);

    return { message: 'Email verified successfully. You may now sign in to your dashboard.' };
  }

  /**
   * Request password reset token (generic response to prevent email enumeration)
   * @param {string} email 
   */
  async forgotPassword(email) {
    if (!email) {
      throw new BadRequestError('Email address is required', 'MISSING_EMAIL');
    }

    const genericMessage = 'If an account exists with this email, you will receive password reset instructions shortly.';

    const user = await authModel.findByEmail(email);
    if (!user || !user.is_active) {
      // Return generic message regardless
      return { message: genericMessage };
    }

    // Generate token & hash with 1 hour expiration
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authModel.createPasswordResetToken(user.id, tokenHash, expiresAt);

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, rawToken, user.full_name || 'Student');

    return { message: genericMessage };
  }

  /**
   * Reset password using token and new password
   * @param {string} rawToken 
   * @param {string} newPassword 
   */
  async resetPassword(rawToken, newPassword) {
    if (!rawToken || !newPassword) {
      throw new BadRequestError('Token and new password are required', 'MISSING_DATA');
    }

    if (newPassword.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters long', 'WEAK_PASSWORD');
    }

    const tokenHash = hashToken(rawToken);
    const tokenRecord = await authModel.findPasswordResetToken(tokenHash);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired password reset token', 'INVALID_TOKEN');
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and invalidate token
    await authModel.updatePassword(tokenRecord.user_id, newPasswordHash);
    await authModel.markPasswordResetTokenUsed(tokenRecord.id);

    return { message: 'Password has been reset successfully. Please sign in with your new password.' };
  }
}

module.exports = new AuthService();
