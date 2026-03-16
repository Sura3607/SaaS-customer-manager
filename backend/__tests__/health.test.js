/**
 * @file health.test.js
 * @description Tests for health check & monitoring endpoints:
 *   GET /health, GET /health/liveness, GET /health/readiness, GET /health/metrics
 */

const { app, request } = require('./setup');

describe('Health Check Endpoints', () => {

  describe('GET /api/v1/health', () => {
    it('should return health status with DB and services info', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeGreaterThan(0);
      expect(res.body.database).toBeDefined();
      expect(res.body.database.status).toBe('connected');
      expect(res.body.services).toBeDefined();
      expect(res.body.services.speedsms).toBeDefined();
      expect(res.body.services.sendgrid).toBeDefined();
    });
  });

  describe('GET /api/v1/health/liveness', () => {
    it('should return alive status', async () => {
      const res = await request(app)
        .get('/api/v1/health/liveness')
        .expect(200);

      expect(res.body.status).toBe('alive');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/v1/health/readiness', () => {
    it('should return ready when DB is connected', async () => {
      const res = await request(app)
        .get('/api/v1/health/readiness')
        .expect(200);

      expect(res.body.status).toBe('ready');
      expect(res.body.database.status).toBe('connected');
    });
  });

  describe('GET /api/v1/health/metrics', () => {
    it('should return application metrics', async () => {
      const res = await request(app)
        .get('/api/v1/health/metrics')
        .expect(200);

      expect(res.body.uptime).toBeGreaterThan(0);
      expect(res.body.requests).toBeDefined();
      expect(res.body.requests.total).toBeGreaterThanOrEqual(0);
      expect(res.body.memory).toBeDefined();
      expect(res.body.memory.rss).toBeDefined();
      expect(res.body.cpu).toBeDefined();
      expect(res.body.database).toBeDefined();
      expect(res.body.nodeVersion).toBeDefined();
    });
  });
});
