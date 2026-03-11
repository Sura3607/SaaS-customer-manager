/**
 * @file ratelimit.middleware.js
 * @description Rate limiting middleware using express-rate-limit.
 * - General: 100 requests per 15 minutes per IP
 * - Messaging: 10 requests per minute per user (anti-spam)
 */

const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

/**
 * General rate limiter for all API endpoints.
 */
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 60 * 1000, // convert minutes to ms
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Strict rate limiter for messaging endpoints (SMS/Email).
 * 10 requests per minute per IP to prevent spam.
 */
const messagingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many messaging requests, please try again later.',
    code: 'MESSAGING_RATE_LIMIT_EXCEEDED',
  },
});

module.exports = { generalLimiter, messagingLimiter };
