const config = require('../config/config');
const logger = require('../core/utils/logger');

/**
 * Transactional Email Service Wrapper
 * Handles verification, password reset, and registration notification emails.
 */
class EmailService {
  /**
   * Send email verification link
   * @param {string} toEmail 
   * @param {string} rawToken 
   * @param {string} fullName 
   */
  async sendVerificationEmail(toEmail, rawToken, fullName = 'Student') {
    const verificationUrl = `${config.cors.origin}/verify-email?token=${rawToken}`;
    
    logger.info(`[EMAIL] Queued Verification Email to ${toEmail}`, {
      recipient: toEmail,
      verificationUrl,
    });

    // In local development or testing, log link to console
    if (!config.isProduction) {
      console.log('--------------------------------------------------');
      console.log(`✉️ [EMAIL SIMULATION] Verification Email for ${fullName}`);
      console.log(`To: ${toEmail}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('--------------------------------------------------');
    }

    return { success: true, messageId: `mock-${Date.now()}` };
  }

  /**
   * Send password reset link
   * @param {string} toEmail 
   * @param {string} rawToken 
   * @param {string} fullName 
   */
  async sendPasswordResetEmail(toEmail, rawToken, fullName = 'User') {
    const resetUrl = `${config.cors.origin}/reset-password?token=${rawToken}`;

    logger.info(`[EMAIL] Queued Password Reset Email to ${toEmail}`, {
      recipient: toEmail,
      resetUrl,
    });

    if (!config.isProduction) {
      console.log('--------------------------------------------------');
      console.log(`✉️ [EMAIL SIMULATION] Password Reset Email for ${fullName}`);
      console.log(`To: ${toEmail}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('--------------------------------------------------');
    }

    return { success: true, messageId: `mock-${Date.now()}` };
  }

  /**
   * Send registration confirmation notification
   * @param {string} toEmail 
   * @param {string} registrationNumber 
   * @param {string} courseName 
   * @param {string} batchName 
   */
  async sendRegistrationConfirmation(toEmail, registrationNumber, courseName, batchName) {
    logger.info(`[EMAIL] Queued Registration Confirmation to ${toEmail}`, {
      registrationNumber,
      courseName,
      batchName,
    });

    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

module.exports = new EmailService();
