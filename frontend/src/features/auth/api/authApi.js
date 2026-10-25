import apiClient from '../../../core/api/apiClient';

export const authApi = {
  /**
   * Log in user with credentials and obtain HTTP-only cookie
   * @param {{ email: string, password: string }} credentials 
   */
  async login({ email, password }) {
    const res = await apiClient.post('/auth/login', { email, password });
    return res;
  },

  /**
   * Log out user and clear cookie
   */
  async logout() {
    const res = await apiClient.post('/auth/logout');
    return res;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.user;
  },

  /**
   * Verify email using token from URL
   * @param {string} token 
   */
  async verifyEmail(token) {
    const res = await apiClient.post('/auth/verify-email', { token });
    return res;
  },

  /**
   * Resend verification email to current authenticated user
   */
  async resendVerification() {
    const res = await apiClient.post('/auth/resend-verification');
    return res;
  },

  /**
   * Request password reset link (always generic message)
   * @param {string} email 
   */
  async forgotPassword(email) {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res;
  },

  /**
   * Reset password with token
   * @param {{ token: string, password: string }} data 
   */
  async resetPassword({ token, password }) {
    const res = await apiClient.post('/auth/reset-password', { token, password });
    return res;
  },
};

export default authApi;
