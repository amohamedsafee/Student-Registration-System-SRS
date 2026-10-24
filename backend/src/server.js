const app = require('./app');
const config = require('./config/config');
const database = require('./config/database');
const logger = require('./core/utils/logger');

async function startServer() {
  try {
    // 1. Verify database connection
    try {
      const dbCheck = await database.testConnection();
      logger.info('MySQL Database connected successfully', {
        database: config.db.database,
        host: config.db.host,
        port: config.db.port,
        serverTime: dbCheck.serverTime,
      });
    } catch (dbErr) {
      logger.warn('MySQL connection warning on startup (Check if MySQL service is running & migrated):', {
        message: dbErr.message,
      });
    }

    // 2. Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`LLC SRS API Server running on port ${config.port}`, {
        env: config.env,
        url: `http://localhost:${config.port}`,
        healthCheck: `http://localhost:${config.port}/api/health`,
      });
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        try {
          const pool = database.getPool();
          await pool.end();
          logger.info('Database pool closed. Exiting process.');
          process.exit(0);
        } catch (err) {
          logger.error('Error closing database pool during shutdown', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds timeout
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal error during server startup', error);
    process.exit(1);
  }
}

startServer();
