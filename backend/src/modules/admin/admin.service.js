const courseModel = require('../courses/course.model');
const batchModel = require('../batches/batch.model');
const registrationModel = require('../registrations/registration.model');
const { generateCsv } = require('../../core/utils/csvHelper');
const { BadRequestError, NotFoundError, ConflictError } = require('../../core/errors/AppError');
const db = require('../../config/database');
const crypto = require('crypto');

class AdminService {
  /* ------------------- COURSE MANAGEMENT ------------------- */

  async getAllCourses() {
    return await courseModel.findAll();
  }

  async createCourse(courseData, adminId, clientIp) {
    if (!courseData.name || !courseData.name.trim()) {
      throw new BadRequestError('Course name is required.');
    }

    const existing = await courseModel.findByName(courseData.name.trim());
    if (existing) {
      throw new ConflictError(`Course with name '${courseData.name}' already exists.`);
    }

    const course = await courseModel.create({
      name: courseData.name.trim(),
      description: courseData.description ? courseData.description.trim() : null,
      duration: courseData.duration ? courseData.duration.trim() : null,
      is_active: courseData.is_active !== undefined ? Boolean(courseData.is_active) : true,
    });

    // Write audit log
    await this.logAudit({
      adminId,
      action: 'COURSE_CREATE',
      entityType: 'courses',
      entityId: course.id,
      details: { name: course.name, is_active: course.is_active },
      clientIp,
    });

    return course;
  }

  async updateCourse(courseId, courseData, adminId, clientIp) {
    const existing = await courseModel.findById(courseId);
    if (!existing) {
      throw new NotFoundError('Course not found.');
    }

    if (courseData.name && courseData.name.trim() !== existing.name) {
      const duplicate = await courseModel.findByName(courseData.name.trim());
      if (duplicate && duplicate.id !== courseId) {
        throw new ConflictError(`Course with name '${courseData.name}' already exists.`);
      }
    }

    const updated = await courseModel.update(courseId, {
      name: courseData.name ? courseData.name.trim() : undefined,
      description: courseData.description !== undefined ? courseData.description.trim() : undefined,
      duration: courseData.duration !== undefined ? courseData.duration.trim() : undefined,
      is_active: courseData.is_active !== undefined ? Boolean(courseData.is_active) : undefined,
    });

    await this.logAudit({
      adminId,
      action: 'COURSE_UPDATE',
      entityType: 'courses',
      entityId: courseId,
      details: { updatedFields: Object.keys(courseData) },
      clientIp,
    });

    return updated;
  }

  async setCourseActive(courseId, isActive, adminId, clientIp) {
    const existing = await courseModel.findById(courseId);
    if (!existing) {
      throw new NotFoundError('Course not found.');
    }

    const updated = await courseModel.setActive(courseId, Boolean(isActive));

    await this.logAudit({
      adminId,
      action: isActive ? 'COURSE_ACTIVATE' : 'COURSE_DEACTIVATE',
      entityType: 'courses',
      entityId: courseId,
      details: { is_active: Boolean(isActive) },
      clientIp,
    });

    return updated;
  }

  /* ------------------- BATCH MANAGEMENT ------------------- */

  async getAllBatches() {
    return await batchModel.findAll();
  }

  async createBatch(batchData, adminId, clientIp) {
    const { course_id, batch_name, start_date, schedule, is_registration_open } = batchData;

    if (!course_id) throw new BadRequestError('course_id is required.');
    if (!batch_name || !batch_name.trim()) throw new BadRequestError('batch_name is required.');
    if (!start_date) throw new BadRequestError('start_date is required.');

    const course = await courseModel.findById(course_id);
    if (!course) throw new NotFoundError('Parent course not found.');

    const duplicate = await batchModel.findByCourseAndName(course_id, batch_name.trim());
    if (duplicate) {
      throw new ConflictError(`A batch named '${batch_name}' already exists under course '${course.name}'.`);
    }

    const batch = await batchModel.create({
      course_id,
      batch_name: batch_name.trim(),
      start_date,
      schedule: schedule ? schedule.trim() : null,
      is_registration_open: is_registration_open !== undefined ? Boolean(is_registration_open) : true,
    });

    await this.logAudit({
      adminId,
      action: 'BATCH_CREATE',
      entityType: 'batches',
      entityId: batch.id,
      details: { course_id, batch_name: batch.batch_name, is_registration_open: batch.is_registration_open },
      clientIp,
    });

    return batch;
  }

  async updateBatch(batchId, batchData, adminId, clientIp) {
    const existing = await batchModel.findById(batchId);
    if (!existing) throw new NotFoundError('Batch not found.');

    const courseId = batchData.course_id || existing.course_id;
    const batchName = batchData.batch_name ? batchData.batch_name.trim() : existing.batch_name;

    const duplicate = await batchModel.findByCourseAndName(courseId, batchName, batchId);
    if (duplicate) {
      throw new ConflictError(`A batch named '${batchName}' already exists under this course.`);
    }

    const updated = await batchModel.update(batchId, {
      course_id: batchData.course_id,
      batch_name: batchData.batch_name ? batchData.batch_name.trim() : undefined,
      start_date: batchData.start_date,
      schedule: batchData.schedule !== undefined ? batchData.schedule.trim() : undefined,
      is_registration_open: batchData.is_registration_open !== undefined ? Boolean(batchData.is_registration_open) : undefined,
    });

    await this.logAudit({
      adminId,
      action: 'BATCH_UPDATE',
      entityType: 'batches',
      entityId: batchId,
      details: { updatedFields: Object.keys(batchData) },
      clientIp,
    });

    return updated;
  }

  async setBatchRegistrationOpen(batchId, isOpen, adminId, clientIp) {
    const existing = await batchModel.findById(batchId);
    if (!existing) throw new NotFoundError('Batch not found.');

    const updated = await batchModel.setRegistrationOpen(batchId, Boolean(isOpen));

    await this.logAudit({
      adminId,
      action: isOpen ? 'BATCH_REGISTRATION_OPEN' : 'BATCH_REGISTRATION_CLOSE',
      entityType: 'batches',
      entityId: batchId,
      details: { is_registration_open: Boolean(isOpen) },
      clientIp,
    });

    return updated;
  }

  /* ------------------- REGISTRATION REVIEW ------------------- */

  async getRegistrations(query) {
    return await registrationModel.findAdminRegistrations(query);
  }

  async getRegistrationDetails(registrationId) {
    const reg = await registrationModel.findAdminRegistrationById(registrationId);
    if (!reg) throw new NotFoundError('Registration not found.');
    return reg;
  }

  async updateRegistrationStatus({ registrationId, newStatus, adminId, note, clientIp }) {
    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestError(`Invalid status '${newStatus}'. Allowed: ${validStatuses.join(', ')}`);
    }

    return await registrationModel.updateAdminRegistrationStatus({
      registrationId,
      newStatus,
      adminId,
      note,
      clientIp,
    });
  }

  /* ------------------- STATS & CSV EXPORT ------------------- */

  async getStats() {
    return await registrationModel.getRegistrationStats();
  }

  async exportRegistrationsCsv(filterParams, adminId, clientIp) {
    const rows = await registrationModel.getRegistrationsForExport(filterParams);

    const columns = [
      { key: 'registration_number', label: 'Registration Number' },
      { key: 'student_name', label: 'Student Full Name' },
      { key: 'student_email', label: 'Email' },
      { key: 'phone_number', label: 'Phone Number' },
      { key: 'whatsapp_number', label: 'WhatsApp Number' },
      { key: 'course_name', label: 'Course' },
      { key: 'batch_name', label: 'Batch' },
      { key: 'status', label: 'Status' },
      { key: 'registration_date', label: 'Registration Date' },
      { key: 'home_address', label: 'Home Address' },
    ];

    const csvContent = generateCsv(rows, columns);

    // Audit log for data export
    await this.logAudit({
      adminId,
      action: 'REGISTRATIONS_CSV_EXPORT',
      entityType: 'registrations',
      entityId: null,
      details: { filters: filterParams, recordCount: rows.length },
      clientIp,
    });

    return csvContent;
  }

  /* ------------------- AUDIT HELPER ------------------- */

  async logAudit({ adminId, action, entityType, entityId, details, clientIp }) {
    try {
      const id = crypto.randomUUID();
      const sql = `
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(sql, [
        id,
        adminId || null,
        action,
        entityType || null,
        entityId || null,
        details ? JSON.stringify(details) : null,
        clientIp || null,
      ]);
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}

module.exports = new AdminService();
