import apiClient from '../../../core/api/apiClient';
import axios from 'axios';

export const adminApi = {
  /* ---------------- Courses ---------------- */
  async getCourses() {
    const res = await apiClient.get('/admin/courses');
    return res.data;
  },

  async createCourse(courseData) {
    const res = await apiClient.post('/admin/courses', courseData);
    return res.data;
  },

  async updateCourse(id, courseData) {
    const res = await apiClient.put(`/admin/courses/${id}`, courseData);
    return res.data;
  },

  async setCourseActive(id, isActive) {
    const res = await apiClient.patch(`/admin/courses/${id}/active`, { is_active: isActive });
    return res.data;
  },

  /* ---------------- Batches ---------------- */
  async getBatches() {
    const res = await apiClient.get('/admin/batches');
    return res.data;
  },

  async createBatch(batchData) {
    const res = await apiClient.post('/admin/batches', batchData);
    return res.data;
  },

  async updateBatch(id, batchData) {
    const res = await apiClient.put(`/admin/batches/${id}`, batchData);
    return res.data;
  },

  async setBatchRegistrationOpen(id, isOpen) {
    const res = await apiClient.patch(`/admin/batches/${id}/registration-open`, { is_registration_open: isOpen });
    return res.data;
  },

  /* ---------------- Registrations Review ---------------- */
  async getRegistrations(params = {}) {
    const res = await apiClient.get('/admin/registrations', { params });
    return res; // returns { data, pagination }
  },

  async getRegistrationDetails(id) {
    const res = await apiClient.get(`/admin/registrations/${id}`);
    return res.data;
  },

  async updateRegistrationStatus(id, status, note = '') {
    const res = await apiClient.patch(`/admin/registrations/${id}/status`, { status, note });
    return res.data;
  },

  /* ---------------- Stats & Export ---------------- */
  async getStats() {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  /**
   * Triggers browser download of CSV file
   */
  async exportCsv(params = {}) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const response = await axios.get(`${baseURL}/admin/registrations/export`, {
      params,
      withCredentials: true,
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `llc-registrations-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default adminApi;
