/**
 * @file server.js
 * @description Server entry point. Starts the Express app.
 */

const { env, validateEnv } = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/db');
const { registerGlobalErrorHandlers } = require('./middlewares/error.middleware');

// Validate environment variables before starting
validateEnv();

// Register global unhandled rejection/exception handlers
registerGlobalErrorHandlers();

const app = require('./app');

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/v1/health`);
});

// ============================================
// Graceful Shutdown
// ============================================

async function gracefulShutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
