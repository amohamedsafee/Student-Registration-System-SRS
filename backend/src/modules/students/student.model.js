const db = require('../../config/database');

class StudentModel {
  /**
   * Find student profile by student ID or auth user ID
   */
  async findByAuthUserId(authUserId) {
    const sql = `
      SELECT 
        s.id AS student_id,
        s.auth_user_id,
        s.full_name,
        s.date_of_birth,
        s.gender,
        s.phone_number,
        s.whatsapp_number,
        s.home_address,
        s.created_at,
        s.updated_at,
        u.email,
        u.role,
        u.email_verified_at
      FROM students s
      JOIN users u ON s.auth_user_id = u.id
      WHERE s.auth_user_id = ?
    `;
    const rows = await db.query(sql, [authUserId]);
    return rows[0] || null;
  }

  /**
   * Update student profile
   */
  async updateProfile(studentId, { fullName, dateOfBirth, gender, phoneNumber, whatsappNumber, homeAddress }) {
    const sql = `
      UPDATE students
      SET 
        full_name = COALESCE(?, full_name),
        date_of_birth = COALESCE(?, date_of_birth),
        gender = COALESCE(?, gender),
        phone_number = COALESCE(?, phone_number),
        whatsapp_number = COALESCE(?, whatsapp_number),
        home_address = COALESCE(?, home_address),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await db.query(sql, [
      fullName || null,
      dateOfBirth || null,
      gender || null,
      phoneNumber || null,
      whatsappNumber || null,
      homeAddress || null,
      studentId,
    ]);

    const selectSql = `
      SELECT 
        s.id AS student_id,
        s.auth_user_id,
        s.full_name,
        s.date_of_birth,
        s.gender,
        s.phone_number,
        s.whatsapp_number,
        s.home_address,
        u.email,
        u.email_verified_at
      FROM students s
      JOIN users u ON s.auth_user_id = u.id
      WHERE s.id = ?
    `;
    const rows = await db.query(selectSql, [studentId]);
    return rows[0] || null;
  }
}

module.exports = new StudentModel();
