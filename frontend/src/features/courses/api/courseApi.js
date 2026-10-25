import apiClient from '../../../core/api/apiClient';

export const courseApi = {
  /**
   * Get all active courses for public catalog
   */
  async getCourses() {
    const res = await apiClient.get('/courses');
    return res.courses || [];
  },

  /**
   * Get course details by ID including its batches
   * @param {string} id 
   */
  async getCourseById(id) {
    const res = await apiClient.get(`/courses/${id}`);
    return res.course;
  },

  /**
   * Get open batches for a specific course
   * @param {string} courseId 
   */
  async getCourseBatches(courseId) {
    const res = await apiClient.get(`/courses/${courseId}/batches`);
    return res.batches || [];
  },

  /**
   * Get batch details by ID
   * @param {string} batchId 
   */
  async getBatchById(batchId) {
    const res = await apiClient.get(`/batches/${batchId}`);
    return res.batch;
  },
};

export default courseApi;
