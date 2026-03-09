/**
 * @file logger.js
 * @description Production-grade structured logger using Winston.
 * Phase 10 — Logging & Error Handling.
 *
 * Outputs:
 *   - Console  (all levels, colorized in dev)
 *   - logs/app.log       (all levels, daily rotation)
 *   - logs/error.log     (error only, daily rotation)
 *
 * Log rotation: daily, max 14 days, max 20 MB per file.
 */

const path = require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { env } = require('../config/env');

const LOG_DIR = path.resolve(__dirname, '../../logs');

/* ───── Custom format ───── */

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
);

/**
 * Sanitise context — strip sensitive keys before writing.
 */
const sanitiseFormat = format((info) => {
  const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret', 'authorization'];
  if (info.context && typeof info.context === 'object') {
    for (const key of Object.keys(info.context)) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        info.context[key] = '***REDACTED***';
      }
    }
  }
  return info;
})();

/* ───── Console format (colorized for dev) ───── */

const consoleFormat = format.combine(
  baseFormat,
  sanitiseFormat,
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const ctx = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    if (stack) return `[${timestamp}] [${level.toUpperCase()}] ${message}\n${stack}`;
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
  }),
);

/* ───── File format (JSON for easy parsing) ───── */

const fileFormat = format.combine(
  baseFormat,
  sanitiseFormat,
  format.json(),
);

/* ───── Transports ───── */

const transportsList = [
  // Console — always active
  new transports.Console({
    level: env.LOG_LEVEL || 'debug',
    format: consoleFormat,
  }),
];

// File transports — only in non-test environments
if (env.NODE_ENV !== 'test') {
  // All levels → logs/app-YYYY-MM-DD.log
  transportsList.push(
    new transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: env.LOG_LEVEL || 'debug',
      format: fileFormat,
    }),
  );

  // Errors only → logs/error-YYYY-MM-DD.log
  transportsList.push(
    new transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat,
    }),
  );
}

/* ───── Create logger ───── */

const winstonLogger = createLogger({
  level: env.LOG_LEVEL || 'debug',
  transports: transportsList,
  // Don't crash on unhandled errors
  exitOnError: false,
});

/* ───── Wrapper to match existing API ───── */

const logger = {
  error(message, context = {}) {
    winstonLogger.error(message, context);
  },
  warn(message, context = {}) {
    winstonLogger.warn(message, context);
  },
  info(message, context = {}) {
    winstonLogger.info(message, context);
  },
  debug(message, context = {}) {
    winstonLogger.debug(message, context);
  },
  /** Access the raw Winston instance if needed */
  _winston: winstonLogger,
};

module.exports = logger;
