/**
 * @file auth.test.js
 * @description Tests for authentication endpoints:
 *   POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me
 */

const { app, request, registerAndLogin, cleanupTenant } = require('./setup');

describe('Auth Endpoints', () => {
  let ctx; // { tenantId, tenantSlug, user, accessToken, refreshToken }

  beforeAll(async () => {
    ctx = await registerAndLogin();
  });

  afterAll(async () => {
    await cleanupTenant(ctx.tenantId);
  });

  // ─── POST /auth/login ─────────────────────────

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ctx.user.email,
          password: 'Test@12345',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe(ctx.user.email);
      expect(res.body.data.tenants).toBeDefined();
      expect(res.body.data.tenants.length).toBeGreaterThanOrEqual(1);
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: ctx.user.email,
          password: 'WrongPassword',
        })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nobody@nowhere.com',
          password: 'Test@12345',
        })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should reject missing fields (validation)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: ctx.user.email })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  // ─── POST /auth/refresh ───────────────────────

  describe('POST /api/v1/auth/refresh', () => {
    it('should return new accessToken with valid refreshToken', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: ctx.refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid refreshToken', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid.token.here' })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });
  });

  // ─── GET /auth/me ─────────────────────────────

  describe('GET /api/v1/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(ctx.user.email);
      expect(res.body.data.tenants).toBeDefined();
      expect(res.body.data.tenants.length).toBeGreaterThanOrEqual(1);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token')
        .expect(401);
    });
  });

  // ─── POST /auth/logout ────────────────────────

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should reject logout without auth', async () => {
      await request(app)
        .post('/api/v1/auth/logout')
        .expect(401);
    });
  });
});
