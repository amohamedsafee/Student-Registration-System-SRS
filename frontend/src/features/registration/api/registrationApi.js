import apiClient from '../../../core/api/apiClient';

export const registrationApi = {
  /**
   * Submit direct intake application (creates user, student, and pending registration)
   */
  async apply(registrationData) {
    const res = await apiClient.post('/registrations/apply', registrationData);
    return res.data;
  },

  /**
   * Logged-in student registers for an additional batch
   */
  async applyAdditional(batchId) {
    const res = await apiClient.post('/registrations', { batch_id: batchId });
    return res.data;
  },

  /**
   * Fetch all registrations owned by current logged-in student
   */
  async getMyRegistrations() {
    const res = await apiClient.get('/registrations/me');
    return res.data;
  },

  /**
   * Fetch single registration owned by current logged-in student
   */
  async getMyRegistrationById(id) {
    const res = await apiClient.get(`/registrations/me/${id}`);
    return res.data;
  },

  /**
   * Cancel pending registration
   */
  async cancelRegistration(id, reason) {
    const res = await apiClient.post(`/registrations/me/${id}/cancel`, { reason });
    return res.data;
  },
};

export default registrationApi;
