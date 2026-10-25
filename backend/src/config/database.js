const mysql = require('mysql2/promise');
const config = require('./config');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: config.db.waitForConnections,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
      timezone: config.db.timezone,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

/**
 * Execute a query with parameterized values
 * @param {string} sql 
 * @param {Array} params 
 * @param {import('mysql2/promise').PoolConnection} [connection] Optional connection for transactions
 */
async function query(sql, params = [], connection = null) {
  const executor = connection || getPool();
  const [rows, fields] = await executor.query(sql, params);
  return rows;
}

/**
 * Execute a callback within an atomic transaction.
 * Automatically BEGIN, COMMIT on success, or ROLLBACK on error.
 * @param {Function} callback (connection) => Promise<any>
 */
async function withTransaction(callback) {
  const p = getPool();
  const connection = await p.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test the database connectivity
 */
async function testConnection() {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    const [result] = await conn.query('SELECT 1 AS connected, NOW() AS serverTime');
    return result[0];
  } finally {
    conn.release();
  }
}

module.exports = {
  getPool,
  query,
  withTransaction,
  testConnection,
};
