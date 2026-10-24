const crypto = require('crypto');
const database = require('../../config/database');

class CourseModel {
  /**
   * Find all active courses for public catalog
   */
  async findAllActive(connection = null) {
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.duration,
        c.is_active,
        c.created_at,
        c.updated_at,
        COUNT(b.id) AS total_batches,
        SUM(CASE WHEN b.is_registration_open = TRUE THEN 1 ELSE 0 END) AS open_batches_count
      FROM courses c
      LEFT JOIN batches b ON b.course_id = c.id
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    return database.query(sql, [], connection);
  }

  /**
   * Find all courses for admin (including inactive)
   */
  async findAll(connection = null) {
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.duration,
        c.is_active,
        c.created_at,
        c.updated_at,
        COUNT(DISTINCT b.id) AS total_batches,
        COUNT(DISTINCT r.id) AS total_registrations
      FROM courses c
      LEFT JOIN batches b ON b.course_id = c.id
      LEFT JOIN registrations r ON r.batch_id = b.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    return database.query(sql, [], connection);
  }

  /**
   * Find course by ID
   * @param {string} id 
   */
  async findById(id, connection = null) {
    const sql = `
      SELECT id, name, description, duration, is_active, created_at, updated_at
      FROM courses
      WHERE id = ?
    `;
    const rows = await database.query(sql, [id], connection);
    return rows[0] || null;
  }

  /**
   * Find course by name (for duplicate check)
   * @param {string} name 
   */
  async findByName(name, connection = null) {
    const sql = 'SELECT id, name, is_active FROM courses WHERE name = ?';
    const rows = await database.query(sql, [name], connection);
    return rows[0] || null;
  }

  /**
   * Create course
   */
  async create({ name, description, duration, is_active = true }, connection = null) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO courses (id, name, description, duration, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    await database.query(sql, [id, name, description || null, duration || null, is_active], connection);
    return this.findById(id, connection);
  }

  /**
   * Update course
   */
  async update(id, { name, description, duration, is_active }, connection = null) {
    const sql = `
      UPDATE courses
      SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        duration = COALESCE(?, duration),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await database.query(sql, [
      name || null,
      description !== undefined ? description : null,
      duration || null,
      is_active !== undefined ? is_active : null,
      id,
    ], connection);
    return this.findById(id, connection);
  }

  /**
   * Toggle active status
   */
  async setActive(id, isActive, connection = null) {
    const sql = 'UPDATE courses SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await database.query(sql, [isActive, id], connection);
    return this.findById(id, connection);
  }
}

module.exports = new CourseModel();
