const registrationService = require('./registration.service');

class RegistrationController {
  /**
   * POST /api/registrations/apply
   * Public direct intake registration endpoint
   */
  async apply(req, res, next) {
    try {
      const result = await registrationService.applyRegistration(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/registrations
   * Authenticated student registering for another course/batch
   */
  async applyAdditional(req, res, next) {
    try {
      const studentId = req.user.student_id;
      const userId = req.user.id;
      const { batch_id } = req.body;

      if (!batch_id) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'batch_id is required' },
        });
      }

      const result = await registrationService.applyAdditionalRegistration(studentId, userId, batch_id);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/registrations/me
   * Authenticated student listing all their own registrations
   */
  async getMyRegistrations(req, res, next) {
    try {
      const studentId = req.user.student_id;
      const registrations = await registrationService.getStudentRegistrations(studentId);
      res.json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/registrations/me/:id
   * Authenticated student viewing a specific registration
   */
  async getMyRegistrationById(req, res, next) {
    try {
      const studentId = req.user.student_id;
      const registration = await registrationService.getStudentRegistrationById(studentId, req.params.id);
      res.json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/registrations/me/:id/cancel
   * Authenticated student requesting cancellation of a pending registration
   */
  async cancelMyRegistration(req, res, next) {
    try {
      const studentId = req.user.student_id;
      const userId = req.user.id;
      const registrationId = req.params.id;
      const reason = req.body?.reason || 'Cancelled by student';

      const result = await registrationService.cancelPendingRegistration(
        studentId,
        userId,
        registrationId,
        reason
      );

      res.json({
        success: true,
        message: 'Registration successfully cancelled.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegistrationController();
