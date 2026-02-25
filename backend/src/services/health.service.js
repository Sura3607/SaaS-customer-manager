/**
 * @file health.service.js
 * @description Health-check logic — probes database and external service reachability.
 */

const prisma = require('../config/db');
const { env } = require('../config/env');
const logger = require('../utils/logger');

// ──────────────────────────────────────────────
// Database probe
// ──────────────────────────────────────────────

/**
 * Execute a cheap query to verify the DB connection is alive.
 * @returns {Promise<{status: string, latencyMs: number}>}
 */
async function checkDatabase() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'connected', latencyMs: Date.now() - start };
  } catch (err) {
    logger.error('Health-check DB probe failed', { error: err.message });
    return { status: 'disconnected', latencyMs: Date.now() - start, error: err.message };
  }
}

// ──────────────────────────────────────────────
// Twilio probe (lightweight — just validates credentials)
// ──────────────────────────────────────────────

/**
 * Verify Twilio connectivity by fetching the account resource.
 * If credentials are dummy / missing, returns "not_configured".
 * @returns {Promise<{status: string, latencyMs?: number}>}
 */
async function checkTwilio() {
  if (
    !env.TWILIO_ACCOUNT_SID ||
    !env.TWILIO_AUTH_TOKEN ||
    env.TWILIO_ACCOUNT_SID.startsWith('AC_DUMMY') ||
    env.TWILIO_ACCOUNT_SID === 'ACxxxxxxxxxxxxxxxxxxxxx'
  ) {
    return { status: 'not_configured' };
  }

  const start = Date.now();
  try {
    const twilio = require('twilio');
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    await client.api.accounts(env.TWILIO_ACCOUNT_SID).fetch();
    return { status: 'reachable', latencyMs: Date.now() - start };
  } catch (err) {
    logger.warn('Health-check Twilio probe failed', { error: err.message });
    return { status: 'unreachable', latencyMs: Date.now() - start, error: err.message };
  }
}

// ──────────────────────────────────────────────
// SendGrid probe (lightweight — API key validation via GET /scopes)
// ──────────────────────────────────────────────

/**
 * Verify SendGrid connectivity by requesting API key scopes.
 * @returns {Promise<{status: string, latencyMs?: number}>}
 */
async function checkSendGrid() {
  if (
    !env.SENDGRID_API_KEY ||
    env.SENDGRID_API_KEY === 'SG.xxxxxxxxxxxxxxxxxxxxx' ||
    env.SENDGRID_API_KEY.startsWith('SG_DUMMY')
  ) {
    return { status: 'not_configured' };
  }

  const start = Date.now();
  try {
    // Use a lightweight HTTP call instead of pulling in the full SDK
    const https = require('https');
    const result = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.sendgrid.com',
          path: '/v3/scopes',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ statusCode: res.statusCode }));
        },
      );
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });

    const ok = result.statusCode >= 200 && result.statusCode < 300;
    return {
      status: ok ? 'reachable' : 'unreachable',
      latencyMs: Date.now() - start,
      ...(ok ? {} : { error: `HTTP ${result.statusCode}` }),
    };
  } catch (err) {
    logger.warn('Health-check SendGrid probe failed', { error: err.message });
    return { status: 'unreachable', latencyMs: Date.now() - start, error: err.message };
  }
}

// ──────────────────────────────────────────────
// Aggregated health check
// ──────────────────────────────────────────────

/**
 * Run all probes and return a single health payload.
 * @returns {Promise<{healthy: boolean, payload: object}>}
 */
async function getHealthStatus() {
  const [db, twilio, sendgrid] = await Promise.all([
    checkDatabase(),
    checkTwilio(),
    checkSendGrid(),
  ]);

  const healthy = db.status === 'connected';

  return {
    healthy,
    payload: {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: require('../../package.json').version || '1.0.0',
      environment: env.NODE_ENV,
      database: db,
      services: {
        twilio,
        sendgrid,
      },
    },
  };
}

// ──────────────────────────────────────────────
// Application metrics
// ──────────────────────────────────────────────

// In-memory counters (reset on process restart — fine for a single-instance SaaS demo)
const counters = {
  requests: 0,
  errors4xx: 0,
  errors5xx: 0,
  startedAt: new Date().toISOString(),
};

/**
 * Increment request counters. Called from request-logging middleware.
 * @param {number} statusCode HTTP response status code
 */
function recordRequest(statusCode) {
  counters.requests += 1;
  if (statusCode >= 400 && statusCode < 500) counters.errors4xx += 1;
  if (statusCode >= 500) counters.errors5xx += 1;
}

/**
 * Build a metrics payload (JSON format).
 * @returns {Promise<object>}
 */
async function getMetrics() {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();

  let dbLatency = null;
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - start;
  } catch (_) {
    dbLatency = -1;
  }

  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    startedAt: counters.startedAt,
    requests: {
      total: counters.requests,
      errors4xx: counters.errors4xx,
      errors5xx: counters.errors5xx,
      errorRate:
        counters.requests > 0
          ? parseFloat(((counters.errors4xx + counters.errors5xx) / counters.requests * 100).toFixed(2))
          : 0,
    },
    memory: {
      rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
      heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
      heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`,
      external: `${(mem.external / 1024 / 1024).toFixed(1)} MB`,
    },
    cpu: {
      user: `${(cpu.user / 1000).toFixed(0)} ms`,
      system: `${(cpu.system / 1000).toFixed(0)} ms`,
    },
    database: {
      latencyMs: dbLatency,
    },
    environment: env.NODE_ENV,
    nodeVersion: process.version,
  };
}

module.exports = {
  getHealthStatus,
  getMetrics,
  recordRequest,
};
