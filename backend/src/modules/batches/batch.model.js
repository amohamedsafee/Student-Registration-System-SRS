const crypto = require('crypto');
const database = require('../../config/database');

class BatchModel {
  /**
   * Find all open batches for a specific course (Public)
   * @param {string} courseId 
   */
  async findOpenByCourseId(courseId, connection = null) {
    const sql = `
      SELECT 
        b.id,
        b.course_id,
        b.batch_name,
        b.start_date,
        b.schedule,
        b.is_registration_open,
        b.created_at,
        b.updated_at
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.course_id = ?
        AND b.is_registration_open = TRUE
        AND c.is_active = TRUE
      ORDER BY b.start_date ASC
    `;
    return database.query(sql, [courseId], connection);
  }

  /**
   * Find all batches with course details and enrollment counts (Admin)
   */
  async findAll(connection = null) {
    const sql = `
      SELECT 
        b.id,
        b.course_id,
        b.batch_name,
        b.start_date,
        b.schedule,
        b.is_registration_open,
        b.created_at,
        b.updated_at,
        c.name AS course_name,
        c.is_active AS is_course_active,
        COUNT(r.id) AS total_registrations
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN registrations r ON r.batch_id = b.id
      GROUP BY b.id
      ORDER BY b.start_date DESC
    `;
    return database.query(sql, [], connection);
  }

  /**
   * Find batch by ID with course details
   * @param {string} id 
   */
  async findById(id, connection = null) {
    const sql = `
      SELECT 
        b.id,
        b.course_id,
        b.batch_name,
        b.start_date,
        b.schedule,
        b.is_registration_open,
        b.created_at,
        b.updated_at,
        c.name AS course_name,
        c.description AS course_description,
        c.duration AS course_duration,
        c.is_active AS is_course_active
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      WHERE b.id = ?
    `;
    const rows = await database.query(sql, [id], connection);
    return rows[0] || null;
  }

  /**
   * Check duplicate batch name under same course
   */
  async findByCourseAndName(courseId, batchName, excludeBatchId = null, connection = null) {
    let sql = 'SELECT id, batch_name FROM batches WHERE course_id = ? AND batch_name = ?';
    const params = [courseId, batchName];
    if (excludeBatchId) {
      sql += ' AND id != ?';
      params.push(excludeBatchId);
    }
    const rows = await database.query(sql, params, connection);
    return rows[0] || null;
  }

  /**
   * Create a new batch
   */
  async create({ course_id, batch_name, start_date, schedule, is_registration_open = true }, connection = null) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO batches (id, course_id, batch_name, start_date, schedule, is_registration_open)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await database.query(sql, [id, course_id, batch_name, start_date, schedule || null, is_registration_open], connection);
    return this.findById(id, connection);
  }

  /**
   * Update an existing batch
   */
  async update(id, { course_id, batch_name, start_date, schedule, is_registration_open }, connection = null) {
    const sql = `
      UPDATE batches
      SET 
        course_id = COALESCE(?, course_id),
        batch_name = COALESCE(?, batch_name),
        start_date = COALESCE(?, start_date),
        schedule = COALESCE(?, schedule),
        is_registration_open = COALESCE(?, is_registration_open),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await database.query(sql, [
      course_id || null,
      batch_name || null,
      start_date || null,
      schedule !== undefined ? schedule : null,
      is_registration_open !== undefined ? is_registration_open : null,
      id,
    ], connection);
    return this.findById(id, connection);
  }

  /**
   * Toggle open/closed registration for a batch
   */
  async setRegistrationOpen(id, isOpen, connection = null) {
    const sql = 'UPDATE batches SET is_registration_open = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [isOpen, id], connection);
    return this.findById(id, connection);
  }
}

module.exports = new BatchModel();
