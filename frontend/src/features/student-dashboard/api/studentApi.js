import apiClient from '../../../core/api/apiClient';

export const studentApi = {
  /**
   * Fetch current authenticated student's profile
   */
  async getProfile() {
    const res = await apiClient.get('/students/me');
    return res.data;
  },

  /**
   * Update current authenticated student's profile
   */
  async updateProfile(profileData) {
    const res = await apiClient.put('/students/me', profileData);
    return res.data;
  },
};

export default studentApi;
