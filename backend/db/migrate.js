const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../src/config/config');

async function runMigrations() {
  console.log('==================================================');
  console.log('🔄 Starting Database Migrations (LLC SRS)');
  console.log(`Database Target: ${config.db.database} on ${config.db.host}:${config.db.port}`);
  console.log('==================================================');

  // Step 1: Connect to MySQL server (without selecting DB) to ensure DB exists
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      multipleStatements: true,
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅ Database \`${config.db.database}\` confirmed/created.`);
  } catch (err) {
    console.error('❌ Failed to verify/create database:', err.message);
    process.exit(1);
  } finally {
    if (rootConn) await rootConn.end();
  }

  // Step 2: Connect to the target database
  const dbConn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
  });

  try {
    // Step 3: Ensure migrations tracking table exists
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) NOT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Step 4: Fetch applied migrations
    const [appliedRows] = await dbConn.query('SELECT name FROM schema_migrations');
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // Step 5: Read migration files from db/migrations
    const migrationsDir = path.resolve(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files in db/migrations:`);

    let newCount = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  ⏭️  [SKIPPED] ${file} (already applied)`);
        continue;
      }

      console.log(`  🚀 [APPLYING] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      // Execute migration within database connection
      await dbConn.query(sqlContent);

      // Record migration
      await dbConn.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
      console.log(`  ✅ [DONE] ${file}`);
      newCount++;
    }

    console.log('==================================================');
    console.log(`🎉 Migrations complete! ${newCount} newly applied, ${appliedSet.size} previously applied.`);
    console.log('==================================================');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await dbConn.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
