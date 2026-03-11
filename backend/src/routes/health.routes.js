/**
 * @file health.routes.js
 * @description Health check & monitoring endpoints (public, no auth required).
 *
 * GET  /          — deep health check (DB + external services)
 * GET  /liveness  — lightweight liveness probe (for Docker / ALB)
 * GET  /readiness — readiness probe (DB must be connected)
 * GET  /metrics   — application metrics (JSON)
 */

const { Router } = require('express');
const { getHealthStatus, getMetrics } = require('../services/health.service');

const router = Router();

// ──────────────────────────────────────────────
// GET /health — deep health check
// ──────────────────────────────────────────────

router.get('/', async (_req, res, next) => {
  try {
    const { healthy, payload } = await getHealthStatus();
    res.status(healthy ? 200 : 503).json(payload);
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /health/liveness — always 200 if the process is up
// ──────────────────────────────────────────────

router.get('/liveness', (_req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
// GET /health/readiness — 200 only when DB is connected
// ──────────────────────────────────────────────

router.get('/readiness', async (_req, res, next) => {
  try {
    const { healthy, payload } = await getHealthStatus();
    if (healthy) {
      res.json({ status: 'ready', database: payload.database });
    } else {
      res.status(503).json({ status: 'not_ready', database: payload.database });
    }
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /health/metrics — application metrics
// ──────────────────────────────────────────────

router.get('/metrics', async (_req, res, next) => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
