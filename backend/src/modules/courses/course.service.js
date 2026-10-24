const courseModel = require('./course.model');
const batchModel = require('../batches/batch.model');
const { NotFoundError } = require('../../core/errors/AppError');

class CourseService {
  /**
   * List all active courses
   */
  async getActiveCourses() {
    return courseModel.findAllActive();
  }

  /**
   * Get course by ID with active verification
   * @param {string} id 
   */
  async getCourseById(id) {
    const course = await courseModel.findById(id);
    if (!course || !course.is_active) {
      throw new NotFoundError('Course not found or currently inactive');
    }

    // Attach open batches to course detail
    const batches = await batchModel.findOpenByCourseId(id);
    return {
      ...course,
      batches,
    };
  }

  /**
   * Get open batches for a specific course
   * @param {string} courseId 
   */
  async getCourseBatches(courseId) {
    const course = await courseModel.findById(courseId);
    if (!course || !course.is_active) {
      throw new NotFoundError('Course not found or inactive');
    }

    return batchModel.findOpenByCourseId(courseId);
  }
}

module.exports = new CourseService();
