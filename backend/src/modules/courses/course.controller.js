const courseService = require('./course.service');

class CourseController {
  /**
   * GET /api/courses - List active courses
   */
  async listCourses(req, res, next) {
    try {
      const courses = await courseService.getActiveCourses();
      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/courses/:id - Course details with open batches
   */
  async getCourse(req, res, next) {
    try {
      const { id } = req.params;
      const course = await courseService.getCourseById(id);
      res.json({ course });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/courses/:id/batches - Open batches for a course
   */
  async getCourseBatches(req, res, next) {
    try {
      const { id } = req.params;
      const batches = await courseService.getCourseBatches(id);
      res.json({ batches });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
