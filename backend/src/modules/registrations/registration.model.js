const crypto = require('crypto');
const db = require('../../config/database');
const { formatRegistrationNumber } = require('../../core/utils/registrationNumber');
const { ConflictError, NotFoundError, BadRequestError } = require('../../core/errors/AppError');

/**
 * Increment registration counter atomically for the given year and return formatted number.
 * Must be executed with a transactional connection.
 */
async function getNextRegistrationNumber(year, connection) {
  const currentYear = year || new Date().getFullYear();
  await connection.query(
    `INSERT INTO registration_counters (year, last_value)
     VALUES (?, LAST_INSERT_ID(1))
     ON DUPLICATE KEY UPDATE last_value = LAST_INSERT_ID(last_value + 1)`,
    [currentYear]
  );

  const [counterRows] = await connection.query('SELECT LAST_INSERT_ID() AS next_val');
  const nextVal = counterRows[0]?.next_val || 1;
  return formatRegistrationNumber(currentYear, nextVal);
}

/**
 * Executes public combined user + student + registration transaction.
 * Runs atomically within connection.
 */
async function createRegistrationTransaction({ userData, studentData, batchId, connection }) {
  // 1. Insert into users table (relies on UNIQUE KEY uq_users_email to prevent race conditions without gap locks)
  const userId = crypto.randomUUID();
  try {
    await connection.query(
      `INSERT INTO users (id, email, password_hash, role, email_verified_at, is_active)
       VALUES (?, ?, ?, 'student', NULL, TRUE)`,
      [userId, userData.email, userData.passwordHash]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
      throw new ConflictError('An account with this email address already exists. Please log in to enroll.');
    }
    throw err;
  }

  // 3. Insert into students table
  const studentId = crypto.randomUUID();
  await connection.query(
    `INSERT INTO students (id, auth_user_id, full_name, date_of_birth, gender, phone_number, whatsapp_number, home_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      userId,
      studentData.fullName,
      studentData.dateOfBirth || null,
      studentData.gender || null,
      studentData.phoneNumber,
      studentData.whatsappNumber || null,
      studentData.homeAddress || null,
    ]
  );

  // 4. Generate next atomic sequential registration number
  const registrationNumber = await getNextRegistrationNumber(new Date().getFullYear(), connection);

  // 5. Insert into registrations table
  const registrationId = crypto.randomUUID();
  await connection.query(
    `INSERT INTO registrations (id, registration_number, student_id, batch_id, status)
     VALUES (?, ?, ?, ?, 'PENDING')`,
    [registrationId, registrationNumber, studentId, batchId]
  );

  // 6. Record initial status history
  const historyId = crypto.randomUUID();
  await connection.query(
    `INSERT INTO registration_status_history (id, registration_id, old_status, new_status, changed_by, note)
     VALUES (?, ?, NULL, 'PENDING', ?, 'Direct intake application submitted')`,
    [historyId, registrationId, userId]
  );

  return {
    userId,
    studentId,
    registrationId,
    registrationNumber,
    status: 'PENDING',
  };
}

/**
 * Allows an already authenticated student to enroll in an additional course/batch
 */
async function createAdditionalRegistrationTransaction({ studentId, userId, batchId, connection }) {
  // Check if student already enrolled in this specific batch
  const [existingReg] = await connection.query(
    'SELECT id, registration_number, status FROM registrations WHERE student_id = ? AND batch_id = ? FOR UPDATE',
    [studentId, batchId]
  );
  if (existingReg && existingReg.length > 0) {
    throw new ConflictError(`You are already enrolled in this batch with registration number ${existingReg[0].registration_number}.`);
  }

  // Generate atomic sequential registration number
  const registrationNumber = await getNextRegistrationNumber(new Date().getFullYear(), connection);

  const registrationId = crypto.randomUUID();
  try {
    await connection.query(
      `INSERT INTO registrations (id, registration_number, student_id, batch_id, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [registrationId, registrationNumber, studentId, batchId]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
      throw new ConflictError('You are already enrolled in this batch.');
    }
    throw err;
  }

  // Status history
  const historyId = crypto.randomUUID();
  await connection.query(
    `INSERT INTO registration_status_history (id, registration_id, old_status, new_status, changed_by, note)
     VALUES (?, ?, NULL, 'PENDING', ?, 'Additional course enrollment submitted')`,
    [historyId, registrationId, userId]
  );

  return {
    registrationId,
    registrationNumber,
    status: 'PENDING',
  };
}

/**
 * Find all registrations belonging to a specific student
 */
async function findStudentRegistrations(studentId) {
  const sql = `
    SELECT 
      r.id,
      r.registration_number,
      r.registration_date,
      r.status,
      r.created_at,
      r.updated_at,
      b.id AS batch_id,
      b.batch_name,
      b.start_date,
      b.schedule,
      c.id AS course_id,
      c.name AS course_name,
      c.duration AS course_duration
    FROM registrations r
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    WHERE r.student_id = ?
    ORDER BY r.created_at DESC
  `;
  return await db.query(sql, [studentId]);
}

/**
 * Find a specific registration by ID, ensuring student ownership
 */
async function findStudentRegistrationById(studentId, registrationId) {
  const sql = `
    SELECT 
      r.id,
      r.registration_number,
      r.registration_date,
      r.status,
      r.created_at,
      r.updated_at,
      b.id AS batch_id,
      b.batch_name,
      b.start_date,
      b.schedule,
      c.id AS course_id,
      c.name AS course_name,
      c.description AS course_description,
      c.duration AS course_duration,
      s.full_name,
      s.phone_number,
      s.whatsapp_number,
      s.home_address
    FROM registrations r
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    JOIN students s ON r.student_id = s.id
    WHERE r.id = ? AND r.student_id = ?
  `;
  const rows = await db.query(sql, [registrationId, studentId]);
  if (!rows || rows.length === 0) return null;

  // Also fetch status history
  const historySql = `
    SELECT id, old_status, new_status, note, changed_at
    FROM registration_status_history
    WHERE registration_id = ?
    ORDER BY changed_at ASC
  `;
  const history = await db.query(historySql, [registrationId]);

  return {
    ...rows[0],
    history,
  };
}

/**
 * Cancel a pending registration by the student owner
 */
async function cancelPendingRegistration(studentId, userId, registrationId, reason = 'Student requested cancellation') {
  return await db.withTransaction(async (conn) => {
    const [rows] = await conn.query(
      'SELECT id, status FROM registrations WHERE id = ? AND student_id = ? FOR UPDATE',
      [registrationId, studentId]
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundError('Registration not found or unauthorized access.');
    }

    const reg = rows[0];
    if (reg.status !== 'PENDING') {
      throw new BadRequestError(`Cannot cancel registration with status ${reg.status}. Only PENDING registrations can be cancelled.`);
    }

    await conn.query(
      'UPDATE registrations SET status = "CANCELLED", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [registrationId]
    );

    const historyId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO registration_status_history (id, registration_id, old_status, new_status, changed_by, note)
       VALUES (?, ?, 'PENDING', 'CANCELLED', ?, ?)`,
      [historyId, registrationId, userId, reason]
    );

    return { id: registrationId, status: 'CANCELLED' };
  });
}

/**
 * Admin: Search, filter, and paginate registrations
 */
async function findAdminRegistrations({
  page = 1,
  limit = 10,
  search = '',
  status = '',
  courseId = '',
  batchId = '',
  dateFrom = '',
  dateTo = '',
}) {
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));

  const whereConditions = [];
  const params = [];

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    whereConditions.push('(r.registration_number LIKE ? OR s.full_name LIKE ? OR s.phone_number LIKE ? OR u.email LIKE ?)');
    params.push(term, term, term, term);
  }

  if (status && status.trim()) {
    whereConditions.push('r.status = ?');
    params.push(status.trim().toUpperCase());
  }

  if (courseId && courseId.trim()) {
    whereConditions.push('b.course_id = ?');
    params.push(courseId.trim());
  }

  if (batchId && batchId.trim()) {
    whereConditions.push('r.batch_id = ?');
    params.push(batchId.trim());
  }

  if (dateFrom && dateFrom.trim()) {
    whereConditions.push('DATE(r.registration_date) >= ?');
    params.push(dateFrom.trim());
  }

  if (dateTo && dateTo.trim()) {
    whereConditions.push('DATE(r.registration_date) <= ?');
    params.push(dateTo.trim());
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Count total matching
  const countSql = `
    SELECT COUNT(*) AS total
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN users u ON s.auth_user_id = u.id
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    ${whereClause}
  `;
  const countResult = await db.query(countSql, params);
  const total = countResult[0]?.total || 0;

  // Fetch paginated rows
  const dataSql = `
    SELECT 
      r.id,
      r.registration_number,
      r.registration_date,
      r.status,
      r.created_at,
      s.id AS student_id,
      s.full_name AS student_name,
      s.phone_number,
      s.whatsapp_number,
      u.email AS student_email,
      b.id AS batch_id,
      b.batch_name,
      b.start_date,
      b.schedule,
      c.id AS course_id,
      c.name AS course_name
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN users u ON s.auth_user_id = u.id
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const rows = await db.query(dataSql, [...params, parsedLimit, offset]);

  return {
    data: rows,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

/**
 * Admin: Detail view with student info and full status audit timeline
 */
async function findAdminRegistrationById(registrationId) {
  const sql = `
    SELECT 
      r.id,
      r.registration_number,
      r.registration_date,
      r.status,
      r.created_at,
      r.updated_at,
      s.id AS student_id,
      s.full_name,
      s.date_of_birth,
      s.gender,
      s.phone_number,
      s.whatsapp_number,
      s.home_address,
      u.id AS user_id,
      u.email,
      u.email_verified_at,
      u.is_active,
      b.id AS batch_id,
      b.batch_name,
      b.start_date,
      b.schedule,
      c.id AS course_id,
      c.name AS course_name,
      c.duration AS course_duration
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN users u ON s.auth_user_id = u.id
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    WHERE r.id = ?
  `;
  const rows = await db.query(sql, [registrationId]);
  if (!rows || rows.length === 0) return null;

  const historySql = `
    SELECT 
      h.id,
      h.old_status,
      h.new_status,
      h.changed_by,
      u.email AS changed_by_email,
      h.note,
      h.changed_at
    FROM registration_status_history h
    LEFT JOIN users u ON h.changed_by = u.id
    WHERE h.registration_id = ?
    ORDER BY h.changed_at ASC
  `;
  const history = await db.query(historySql, [registrationId]);

  return {
    ...rows[0],
    history,
  };
}

/**
 * Admin: Update registration status, write history and audit log
 */
async function updateAdminRegistrationStatus({ registrationId, newStatus, adminId, note, clientIp }) {
  return await db.withTransaction(async (conn) => {
    const [rows] = await conn.query(
      'SELECT id, status, registration_number, student_id, batch_id FROM registrations WHERE id = ? FOR UPDATE',
      [registrationId]
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundError('Registration not found.');
    }

    const currentReg = rows[0];
    const oldStatus = currentReg.status;

    if (oldStatus === newStatus) {
      return { id: registrationId, status: newStatus, unchanged: true };
    }

    // Update status
    await conn.query(
      'UPDATE registrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, registrationId]
    );

    // Record status history
    const historyId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO registration_status_history (id, registration_id, old_status, new_status, changed_by, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [historyId, registrationId, oldStatus, newStatus, adminId, note || null]
    );

    // Record audit log
    const auditId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, ip_address)
       VALUES (?, ?, 'REGISTRATION_STATUS_UPDATE', 'registrations', ?, ?, ?)`,
      [
        auditId,
        adminId,
        registrationId,
        JSON.stringify({
          registration_number: currentReg.registration_number,
          old_status: oldStatus,
          new_status: newStatus,
          note,
        }),
        clientIp || null,
      ]
    );

    return {
      id: registrationId,
      registrationNumber: currentReg.registration_number,
      oldStatus,
      newStatus,
    };
  });
}

/**
 * Admin: Overview statistics for metrics dashboard
 */
async function getRegistrationStats() {
  // 1. Total registrations
  const [totalRow] = await db.query('SELECT COUNT(*) AS total FROM registrations');
  const total = totalRow?.total || 0;

  // 2. Counts grouped by status
  const statusCounts = await db.query(`
    SELECT status, COUNT(*) AS count
    FROM registrations
    GROUP BY status
  `);
  const byStatus = {
    PENDING: 0,
    UNDER_REVIEW: 0,
    CONFIRMED: 0,
    REJECTED: 0,
    CANCELLED: 0,
  };
  statusCounts.forEach((row) => {
    byStatus[row.status] = row.count;
  });

  // 3. Registrations today
  const [todayRow] = await db.query(`
    SELECT COUNT(*) AS count 
    FROM registrations 
    WHERE DATE(registration_date) = CURDATE()
  `);
  const registeredToday = todayRow?.count || 0;

  // 4. Counts grouped by course
  const byCourse = await db.query(`
    SELECT c.id, c.name, COUNT(r.id) AS count
    FROM courses c
    LEFT JOIN batches b ON b.course_id = c.id
    LEFT JOIN registrations r ON r.batch_id = b.id
    GROUP BY c.id, c.name
    ORDER BY count DESC
  `);

  // 5. Counts grouped by batch
  const byBatch = await db.query(`
    SELECT b.id, b.batch_name, c.name AS course_name, COUNT(r.id) AS count
    FROM batches b
    JOIN courses c ON b.course_id = c.id
    LEFT JOIN registrations r ON r.batch_id = b.id
    GROUP BY b.id, b.batch_name, c.name
    ORDER BY count DESC
  `);

  return {
    total,
    registeredToday,
    byStatus,
    byCourse,
    byBatch,
  };
}

/**
 * Export registrations for CSV with filter conditions
 */
async function getRegistrationsForExport({ status, courseId, batchId, dateFrom, dateTo }) {
  const whereConditions = [];
  const params = [];

  if (status && status.trim()) {
    whereConditions.push('r.status = ?');
    params.push(status.trim().toUpperCase());
  }
  if (courseId && courseId.trim()) {
    whereConditions.push('b.course_id = ?');
    params.push(courseId.trim());
  }
  if (batchId && batchId.trim()) {
    whereConditions.push('r.batch_id = ?');
    params.push(batchId.trim());
  }
  if (dateFrom && dateFrom.trim()) {
    whereConditions.push('DATE(r.registration_date) >= ?');
    params.push(dateFrom.trim());
  }
  if (dateTo && dateTo.trim()) {
    whereConditions.push('DATE(r.registration_date) <= ?');
    params.push(dateTo.trim());
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      r.registration_number,
      s.full_name AS student_name,
      u.email AS student_email,
      s.phone_number,
      s.whatsapp_number,
      c.name AS course_name,
      b.batch_name,
      r.status,
      DATE_FORMAT(r.registration_date, '%Y-%m-%d %H:%i') AS registration_date,
      s.home_address
    FROM registrations r
    JOIN students s ON r.student_id = s.id
    JOIN users u ON s.auth_user_id = u.id
    JOIN batches b ON r.batch_id = b.id
    JOIN courses c ON b.course_id = c.id
    ${whereClause}
    ORDER BY r.registration_date DESC
  `;

  return await db.query(sql, params);
}

module.exports = {
  getNextRegistrationNumber,
  createRegistrationTransaction,
  createAdditionalRegistrationTransaction,
  findStudentRegistrations,
  findStudentRegistrationById,
  cancelPendingRegistration,
  findAdminRegistrations,
  findAdminRegistrationById,
  updateAdminRegistrationStatus,
  getRegistrationStats,
  getRegistrationsForExport,
};
