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
}

module.exports = new CourseModel();
