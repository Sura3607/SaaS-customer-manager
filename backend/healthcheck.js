/**
 * @file healthcheck.js
 * @description Lightweight HTTP health-check script used by Docker HEALTHCHECK.
 * Exits 0 if /api/v1/health/liveness returns 200, otherwise exits 1.
 */

/* eslint-disable no-process-exit */
const http = require('http');

const PORT = process.env.PORT || 5000;

const req = http.get(`http://localhost:${PORT}/api/v1/health/liveness`, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => {
  process.exit(1);
});

req.setTimeout(3000, () => {
  req.destroy();
  process.exit(1);
});
