const studentService = require('./student.service');

class StudentController {
  /**
   * GET /api/students/me
   */
  async getMe(req, res, next) {
    try {
      const profile = await studentService.getProfile(req.user.id);
      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/me
   */
  async updateMe(req, res, next) {
    try {
      const updated = await studentService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
