/**
 * @file customers.test.js
 * @description Tests for customer CRUD endpoints:
 *   GET /customers, POST /customers, GET /customers/:id,
 *   PUT /customers/:id, DELETE /customers/:id, POST /customers/bulk
 */

const { app, request, registerAndLogin, cleanupTenant } = require('./setup');

describe('Customer CRUD Endpoints', () => {
  let ctx;
  let customerId;

  const CUSTOMER_DATA = {
    fullName: 'Nguyen Van Test',
    email: `cust_${Date.now()}@test.com`,
    phone: `+8490${Date.now().toString().slice(-7)}`,
    address: '123 Test Street, HCMC',
  };

  beforeAll(async () => {
    ctx = await registerAndLogin();
  });

  afterAll(async () => {
    await cleanupTenant(ctx.tenantId);
  });

  // ─── POST /customers ──────────────────────────

  describe('POST /api/v1/customers', () => {
    it('should create a new customer', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send(CUSTOMER_DATA)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe(CUSTOMER_DATA.fullName);
      expect(res.body.data.email).toBe(CUSTOMER_DATA.email);
      expect(res.body.data.tenantId).toBe(ctx.tenantId);
      customerId = res.body.data.id;
    });

    it('should reject duplicate email within same tenant', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send(CUSTOMER_DATA)
        .expect(409);

      expect(res.body.error).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ fullName: 'Lonely' })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ ...CUSTOMER_DATA, email: 'not-an-email', phone: '+84900111222' })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .post('/api/v1/customers')
        .send(CUSTOMER_DATA)
        .expect(401);
    });
  });

  // ─── GET /customers ───────────────────────────

  describe('GET /api/v1/customers', () => {
    it('should list customers for the tenant', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(1);
    });

    it('should support search query', async () => {
      const res = await request(app)
        .get('/api/v1/customers?q=Nguyen')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].fullName).toContain('Nguyen');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/v1/customers?page=1&limit=1')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(1);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(1);
    });
  });

  // ─── GET /customers/:id ───────────────────────

  describe('GET /api/v1/customers/:id', () => {
    it('should get customer by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/customers/${customerId}`)
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(customerId);
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app)
        .get('/api/v1/customers/nonexistent-id-12345')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(404);
    });
  });

  // ─── PUT /customers/:id ───────────────────────

  describe('PUT /api/v1/customers/:id', () => {
    it('should update customer', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/${customerId}`)
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ fullName: 'Updated Name' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Updated Name');
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app)
        .put('/api/v1/customers/nonexistent-id-12345')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ fullName: 'Ghost' })
        .expect(404);
    });
  });

  // ─── POST /customers/bulk ─────────────────────

  describe('POST /api/v1/customers/bulk', () => {
    it('should bulk create customers', async () => {
      const suffix = Date.now();
      const customers = [
        { fullName: 'Bulk A', email: `bulka_${suffix}@test.com`, phone: `+849${suffix.toString().slice(-8)}1` },
        { fullName: 'Bulk B', email: `bulkb_${suffix}@test.com`, phone: `+849${suffix.toString().slice(-8)}2` },
      ];

      const res = await request(app)
        .post('/api/v1/customers/bulk')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ customers })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.createdCount).toBe(2);
    });

    it('should reject empty array', async () => {
      const res = await request(app)
        .post('/api/v1/customers/bulk')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ customers: [] })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  // ─── DELETE /customers/:id ────────────────────

  describe('DELETE /api/v1/customers/:id', () => {
    it('should delete customer', async () => {
      await request(app)
        .delete(`/api/v1/customers/${customerId}`)
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(204);
    });

    it('should return 404 for already deleted customer', async () => {
      await request(app)
        .delete(`/api/v1/customers/${customerId}`)
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .expect(404);
    });
  });
});
