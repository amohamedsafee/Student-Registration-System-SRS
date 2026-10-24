const database = require('../../config/database');

class BatchModel {
  /**
   * Find all open batches for a specific course
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
}

module.exports = new BatchModel();
