const database = require('../../config/database');

class AuthModel {
  /**
   * Find user by email (including password_hash for authentication)
   * @param {string} email 
   */
  async findByEmail(email, connection = null) {
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.password_hash,
        u.role,
        u.email_verified_at,
        u.is_active,
        u.last_login_at,
        s.id AS student_id,
        s.full_name,
        s.phone_number
      FROM users u
      LEFT JOIN students s ON s.auth_user_id = u.id
      WHERE u.email = ?
    `;
    const rows = await database.query(sql, [email.toLowerCase().trim()], connection);
    return rows[0] || null;
  }

  /**
   * Find user by ID (sanitized, excluding password_hash)
   * @param {string} id 
   */
  async findById(id, connection = null) {
    const sql = `
      SELECT 
        u.id,
        u.email,
        u.role,
        u.email_verified_at,
        u.is_active,
        u.last_login_at,
        u.created_at,
        s.id AS student_id,
        s.full_name,
        s.phone_number,
        s.whatsapp_number,
        s.home_address
      FROM users u
      LEFT JOIN students s ON s.auth_user_id = u.id
      WHERE u.id = ?
    `;
    const rows = await database.query(sql, [id], connection);
    return rows[0] || null;
  }

  /**
   * Update last login timestamp
   * @param {string} id 
   */
  async updateLastLogin(id, connection = null) {
    const sql = 'UPDATE users SET last_login_at = NOW() WHERE id = ?';
    return database.query(sql, [id], connection);
  }

  /**
   * Update user password hash
   * @param {string} id 
   * @param {string} passwordHash 
   */
  async updatePassword(id, passwordHash, connection = null) {
    const sql = 'UPDATE users SET password_hash = ? WHERE id = ?';
    return database.query(sql, [passwordHash, id], connection);
  }

  /**
   * Mark user's email as verified
   * @param {string} id 
   */
  async markEmailVerified(id, connection = null) {
    const sql = 'UPDATE users SET email_verified_at = NOW() WHERE id = ?';
    return database.query(sql, [id], connection);
  }

  /* ------------------- TOKEN OPERATIONS ------------------- */

  /**
   * Create an email verification token
   * @param {string} userId 
   * @param {string} tokenHash 
   * @param {Date} expiresAt 
   */
  async createVerificationToken(userId, tokenHash, expiresAt, connection = null) {
    const sql = `
      INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `;
    return database.query(sql, [userId, tokenHash, expiresAt], connection);
  }

  /**
   * Find a valid, unexpired, unused verification token
   * @param {string} tokenHash 
   */
  async findVerificationToken(tokenHash, connection = null) {
    const sql = `
      SELECT id, user_id, token_hash, expires_at, used_at, created_at
      FROM email_verification_tokens
      WHERE token_hash = ?
        AND used_at IS NULL
        AND expires_at > NOW()
    `;
    const rows = await database.query(sql, [tokenHash], connection);
    return rows[0] || null;
  }

  /**
   * Mark verification token as used
   * @param {string} tokenId 
   */
  async markVerificationTokenUsed(tokenId, connection = null) {
    const sql = 'UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?';
    return database.query(sql, [tokenId], connection);
  }

  /**
   * Create password reset token
   * @param {string} userId 
   * @param {string} tokenHash 
   * @param {Date} expiresAt 
   */
  async createPasswordResetToken(userId, tokenHash, expiresAt, connection = null) {
    const sql = `
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `;
    return database.query(sql, [userId, tokenHash, expiresAt], connection);
  }

  /**
   * Find a valid, unexpired, unused password reset token
   * @param {string} tokenHash 
   */
  async findPasswordResetToken(tokenHash, connection = null) {
    const sql = `
      SELECT id, user_id, token_hash, expires_at, used_at, created_at
      FROM password_reset_tokens
      WHERE token_hash = ?
        AND used_at IS NULL
        AND expires_at > NOW()
    `;
    const rows = await database.query(sql, [tokenHash], connection);
    return rows[0] || null;
  }

  /**
   * Mark password reset token as used
   * @param {string} tokenId 
   */
  async markPasswordResetTokenUsed(tokenId, connection = null) {
    const sql = 'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?';
    return database.query(sql, [tokenId], connection);
  }
}

module.exports = new AuthModel();
