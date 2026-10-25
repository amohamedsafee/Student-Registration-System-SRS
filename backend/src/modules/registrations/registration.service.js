const bcrypt = require('bcryptjs');
const db = require('../../config/database');
const registrationModel = require('./registration.model');
const batchModel = require('../batches/batch.model');
const authModel = require('../auth/auth.model');
const emailService = require('../../third-party/email.service');
const { generateSecureToken, hashToken, getTokenExpiryDate } = require('../../core/utils/tokenHelper');
const { BadRequestError, NotFoundError, ConflictError } = require('../../core/errors/AppError');
const logger = require('../../core/utils/logger');

class RegistrationService {
  /**
   * Public direct intake registration endpoint.
   * Runs inside a single database transaction across users, students, atomic counter, and registrations.
   */
  async applyRegistration(data) {
    const {
      full_name,
      email,
      password,
      phone_number,
      whatsapp_number,
      date_of_birth,
      gender,
      home_address,
      batch_id,
    } = data;

    // 1. Re-check batch existence and status
    const batch = await batchModel.findById(batch_id);
    if (!batch) {
      throw new NotFoundError('Selected batch does not exist.');
    }

    if (!batch.is_course_active) {
      throw new BadRequestError('The course associated with this batch is currently inactive.');
    }

    if (!batch.is_registration_open) {
      throw new BadRequestError('Registration for this batch is currently closed.');
    }

    // 2. Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Generate verification token before transaction so we can insert within the transaction
    const rawVerificationToken = generateSecureToken();
    const hashedVerificationToken = hashToken(rawVerificationToken);
    const verificationExpiry = getTokenExpiryDate(24); // 24 hours

    // 4. Execute atomic transaction
    const result = await db.withTransaction(async (connection) => {
      // Create user + student + counter + registration + history
      const txResult = await registrationModel.createRegistrationTransaction({
        userData: {
          email: email.toLowerCase().trim(),
          passwordHash,
        },
        studentData: {
          fullName: full_name.trim(),
          phoneNumber: phone_number.trim(),
          whatsappNumber: whatsapp_number ? whatsapp_number.trim() : null,
          dateOfBirth: date_of_birth || null,
          gender: gender || null,
          homeAddress: home_address ? home_address.trim() : null,
        },
        batchId: batch_id,
        connection,
      });

      // Insert email verification token
      await authModel.createVerificationToken(
        txResult.userId,
        hashedVerificationToken,
        verificationExpiry,
        connection
      );

      return txResult;
    });

    // 5. Send asynchronous emails (non-blocking)
    try {
      emailService.sendVerificationEmail(email, rawVerificationToken, full_name).catch((err) => {
        logger.error('Failed to dispatch verification email:', err);
      });

      emailService.sendRegistrationConfirmation(
        email,
        result.registrationNumber,
        batch.course_name,
        batch.batch_name
      ).catch((err) => {
        logger.error('Failed to dispatch registration confirmation email:', err);
      });
    } catch (emailErr) {
      logger.warn('Non-fatal email dispatch failure:', emailErr);
    }

    return {
      registration_number: result.registrationNumber,
      status: result.status,
      message: 'Registration submitted successfully. Please verify your email to activate your account.',
    };
  }

  /**
   * Logged-in student enrolling in an additional batch/course
   */
  async applyAdditionalRegistration(studentId, userId, batchId) {
    const batch = await batchModel.findById(batchId);
    if (!batch) {
      throw new NotFoundError('Selected batch does not exist.');
    }

    if (!batch.is_course_active) {
      throw new BadRequestError('The course associated with this batch is currently inactive.');
    }

    if (!batch.is_registration_open) {
      throw new BadRequestError('Registration for this batch is currently closed.');
    }

    const result = await db.withTransaction(async (connection) => {
      return await registrationModel.createAdditionalRegistrationTransaction({
        studentId,
        userId,
        batchId,
        connection,
      });
    });

    return {
      registration_number: result.registrationNumber,
      status: result.status,
      message: 'Enrollment submitted successfully. Your registration is now pending review.',
    };
  }

  /**
   * Student self-management: list own registrations
   */
  async getStudentRegistrations(studentId) {
    if (!studentId) {
      throw new NotFoundError('Student profile not found.');
    }
    return await registrationModel.findStudentRegistrations(studentId);
  }

  /**
   * Student self-management: view single own registration
   */
  async getStudentRegistrationById(studentId, registrationId) {
    if (!studentId) {
      throw new NotFoundError('Student profile not found.');
    }
    const registration = await registrationModel.findStudentRegistrationById(studentId, registrationId);
    if (!registration) {
      // 404 to avoid leaking existence of other student records
      throw new NotFoundError('Registration not found.');
    }
    return registration;
  }

  /**
   * Student self-management: cancel pending registration
   */
  async cancelPendingRegistration(studentId, userId, registrationId, reason) {
    return await registrationModel.cancelPendingRegistration(studentId, userId, registrationId, reason);
  }

  /**
   * Admin operations: search, filter, paginate registrations
   */
  async getAdminRegistrations(filterParams) {
    return await registrationModel.findAdminRegistrations(filterParams);
  }

  /**
   * Admin operations: get detailed registration
   */
  async getAdminRegistrationById(registrationId) {
    const reg = await registrationModel.findAdminRegistrationById(registrationId);
    if (!reg) {
      throw new NotFoundError('Registration not found.');
    }
    return reg;
  }

  /**
   * Admin operations: update status
   */
  async updateAdminRegistrationStatus({ registrationId, newStatus, adminId, note, clientIp }) {
    const allowedStatuses = ['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestError(`Invalid status '${newStatus}'. Allowed: ${allowedStatuses.join(', ')}`);
    }

    return await registrationModel.updateAdminRegistrationStatus({
      registrationId,
      newStatus,
      adminId,
      note,
      clientIp,
    });
  }

  /**
   * Admin operations: get metrics & summary
   */
  async getAdminStats() {
    return await registrationModel.getRegistrationStats();
  }

  /**
   * Admin operations: CSV export
   */
  async getRegistrationsForExport(filterParams) {
    return await registrationModel.getRegistrationsForExport(filterParams);
  }
}

module.exports = new RegistrationService();
