/**
 * @file env.js
 * @description Environment variable configuration with validation.
 * Reads from .env file and provides defaults where appropriate.
 */

require('dotenv').config();

const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  FRONTEND_URL: process.env.FRONTEND_URL || '',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',

  // SpeedSMS
  SPEEDSMS_API_TOKEN: process.env.SPEEDSMS_API_TOKEN,
  SPEEDSMS_SENDER: process.env.SPEEDSMS_SENDER || '',

  // SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'noreply@saas.example.com',
  SENDGRID_WEBHOOK_VERIFICATION_KEY: process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY,

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};

/**
 * Validate that all required environment variables are set.
 * Throws an error at startup if critical variables are missing.
 */
function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file.'
    );
  }

  // Warnings for optional but important variables
  const warnings = [];
  if (!env.DATABASE_URL) {
    warnings.push('DATABASE_URL is not set — database features will not work.');
  }
  if (!env.SPEEDSMS_API_TOKEN) {
    warnings.push('SPEEDSMS_API_TOKEN is not set — SMS features will not work.');
  }
  if (!env.SENDGRID_API_KEY) {
    warnings.push('SENDGRID_API_KEY is not set — Email features will not work.');
  }

  if (warnings.length > 0) {
    console.warn('[ENV WARNING]', warnings.join('\n  '));
  }
}

module.exports = { env, validateEnv };
