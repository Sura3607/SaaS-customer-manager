/**
 * @file error.middleware.js
 * @description Global error handling middleware.
 * Phase 10 — Enhanced logging, sensitive data masking, unhandled error catchers.
 */

const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Mask sensitive fields in request body for logging.
 */
function maskBody(body) {
  if (!body || typeof body !== 'object') return body;
  const masked = { ...body };
  const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret', 'creditCard'];
  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      masked[key] = '***REDACTED***';
    }
  }
  return masked;
}

/**
 * Global error handler — must be the last middleware registered.
 */
function errorHandler(err, req, res, _next) {
  // Build error context for logging
  const errorContext = {
    code: err.code,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    userId: req.user?.userId,
    tenantId: req.tenantId,
    ip: req.ip,
    body: maskBody(req.body),
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorContext.stack = err.stack;
  }

  // Log the error
  logger.error(err.message, errorContext);

  // If it's a known operational error (AppError subclass)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details && { details: err.details }),
    });
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists.',
      code: 'DUPLICATE_ENTRY',
      details: err.meta,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found.',
      code: 'NOT_FOUND',
    });
  }

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }

  // Unknown / unexpected errors
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    code: 'INTERNAL_ERROR',
  });
}

/**
 * Register global handlers for unhandled rejections / exceptions.
 * Call this once at server startup.
 */
function registerGlobalErrorHandlers() {
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception — shutting down', {
      error: error.message,
      stack: error.stack,
    });
    // Give logger time to flush before exit
    setTimeout(() => process.exit(1), 1000);
  });
}

module.exports = { errorHandler, registerGlobalErrorHandlers };
