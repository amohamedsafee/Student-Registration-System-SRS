const batchModel = require('./batch.model');
const courseModel = require('../courses/course.model');
const { NotFoundError } = require('../../core/errors/AppError');

class BatchService {
  /**
   * Get open batches for a given course
   * @param {string} courseId 
   */
  async getOpenBatchesForCourse(courseId) {
    const course = await courseModel.findById(courseId);
    if (!course || !course.is_active) {
      throw new NotFoundError('Course not found or inactive');
    }

    const batches = await batchModel.findOpenByCourseId(courseId);
    return batches;
  }

  /**
   * Get batch details by ID
   * @param {string} id 
   */
  async getBatchById(id) {
    const batch = await batchModel.findById(id);
    if (!batch || !batch.is_course_active) {
      throw new NotFoundError('Batch not found or associated course is inactive');
    }

    return batch;
  }
}

module.exports = new BatchService();
