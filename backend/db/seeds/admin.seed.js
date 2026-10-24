const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const config = require('../../src/config/config');

async function seedAdmin(connection) {
  console.log('👤 Seeding Administrator account from environment variables...');

  const { email, password, name } = config.adminSeed;

  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not configured. Skipping admin seed.');
    return;
  }

  // Check if admin user already exists
  const [existing] = await connection.query('SELECT id, email, role FROM users WHERE email = ?', [email]);

  if (existing.length > 0) {
    console.log(`  ℹ️  Admin with email "${email}" already exists (ID: ${existing[0].id}).`);
    return existing[0].id;
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Insert user
  const [userResult] = await connection.query(
    `INSERT INTO users (email, password_hash, role, email_verified_at, is_active)
     VALUES (?, ?, 'admin', NOW(), TRUE)`,
    [email, passwordHash]
  );

  // Fetch created admin user id
  const [adminUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
  const adminId = adminUser[0].id;

  console.log(`  ✅ Admin account created successfully!`);
  console.log(`     Email: ${email}`);
  console.log(`     Role:  admin`);
  console.log(`     ID:    ${adminId}`);

  return adminId;
}

module.exports = seedAdmin;
