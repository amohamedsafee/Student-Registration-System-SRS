const mysql = require('mysql2/promise');
const config = require('../src/config/config');
const seedAdmin = require('./seeds/admin.seed');
const seedCourses = require('./seeds/courses.seed');

async function runSeeds() {
  console.log('==================================================');
  console.log('🌱 Starting Database Seeding (LLC SRS)');
  console.log(`Database Target: ${config.db.database} on ${config.db.host}:${config.db.port}`);
  console.log('==================================================');

  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    });

    // 1. Seed administrator
    await seedAdmin(connection);

    // 2. Seed courses & batches
    await seedCourses(connection);

    console.log('==================================================');
    console.log('🌟 All Database Seeds Applied Successfully!');
    console.log('==================================================');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  runSeeds();
}

module.exports = runSeeds;
