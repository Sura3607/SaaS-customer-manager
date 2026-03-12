/**
 * @file integration.test.js
 * @description Full workflow integration test:
 *   Register tenant → Login → Create customer → (Skip real SMS/Email) → View logs
 *   Also tests multi-tenant isolation and error scenarios.
 */

const { app, request, cleanupTenant } = require('./setup');

describe('Integration Workflow', () => {
  let tenantA = {};
  let tenantB = {};

  // ─── Workflow: Register → Login → CRUD → Logs ─

  describe('Full Workflow (Tenant A)', () => {
    const ts = Date.now();

    it('Step 1: Register a new tenant', async () => {
      const res = await request(app)
        .post('/api/v1/tenants/register')
        .send({
          companyName: `IntegCorp_${ts}`,
          adminEmail: `integ_${ts}@test.com`,
          adminPassword: 'Integ@12345',
          phone: '+84900000099',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      tenantA.id = res.body.data.tenant.id;
      tenantA.slug = res.body.data.tenant.slug;
      tenantA.email = `integ_${ts}@test.com`;
    });

    it('Step 2: Login as admin', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: tenantA.email,
          password: 'Integ@12345',
        })
        .expect(200);

      tenantA.loginToken = res.body.data.accessToken;
      tenantA.refreshToken = res.body.data.refreshToken;

      // Select tenant to get tenant-scoped token
      const selectRes = await request(app)
        .post('/api/v1/auth/select-tenant')
        .set('Authorization', `Bearer ${tenantA.loginToken}`)
        .send({ tenantId: tenantA.id })
        .expect(200);

      tenantA.token = selectRes.body.data.accessToken;
    });

    it('Step 3: Get tenant stats (initially zero customers)', async () => {
      const res = await request(app)
        .get(`/api/v1/tenants/${tenantA.id}/stats`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      expect(res.body.data.customers).toBe(0);
    });

    it('Step 4: Create a customer', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${tenantA.token}`)
        .send({
          fullName: 'Workflow Customer',
          email: `wfcust_${ts}@test.com`,
          phone: `+849${ts.toString().slice(-8)}0`,
          address: '1 Workflow St',
        })
        .expect(201);

      tenantA.customerId = res.body.data.id;
    });

    it('Step 5: Verify customer appears in listing', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      expect(res.body.total).toBe(1);
      expect(res.body.data[0].id).toBe(tenantA.customerId);
    });

    it('Step 6: Get tenant stats (1 customer now)', async () => {
      const res = await request(app)
        .get(`/api/v1/tenants/${tenantA.id}/stats`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      expect(res.body.data.customers).toBe(1);
    });

    it('Step 7: View message logs (empty — no real sends)', async () => {
      const res = await request(app)
        .get('/api/v1/messages/logs')
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('Step 8: Update customer name', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/${tenantA.customerId}`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .send({ fullName: 'Updated Workflow Customer' })
        .expect(200);

      expect(res.body.data.fullName).toBe('Updated Workflow Customer');
    });

    it('Step 9: Delete customer', async () => {
      await request(app)
        .delete(`/api/v1/customers/${tenantA.customerId}`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(204);
    });

    it('Step 10: Confirm customer deleted', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      expect(res.body.total).toBe(0);
    });
  });

  // ─── Multi-tenant Isolation ───────────────────

  describe('Multi-Tenant Isolation', () => {
    const ts2 = Date.now() + 1;

    beforeAll(async () => {
      // Register Tenant B
      const res = await request(app)
        .post('/api/v1/tenants/register')
        .send({
          companyName: `IsolationCorp_${ts2}`,
          adminEmail: `iso_${ts2}@test.com`,
          adminPassword: 'Iso@12345',
          phone: '+84900000088',
        });
      tenantB.id = res.body.data.tenant.id;
      tenantB.slug = res.body.data.tenant.slug;

      // Login Tenant B
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: `iso_${ts2}@test.com`,
          password: 'Iso@12345',
        });
      const loginToken = loginRes.body.data.accessToken;

      // Select tenant B
      const selectRes = await request(app)
        .post('/api/v1/auth/select-tenant')
        .set('Authorization', `Bearer ${loginToken}`)
        .send({ tenantId: tenantB.id });
      tenantB.token = selectRes.body.data.accessToken;

      // Create a customer in Tenant B
      const custRes = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${tenantB.token}`)
        .send({
          fullName: 'Tenant B Customer',
          email: `tenb_${ts2}@test.com`,
          phone: `+849${ts2.toString().slice(-8)}0`,
        });
      tenantB.customerId = custRes.body.data.id;
    });

    it('Tenant A cannot see Tenant B customers', async () => {
      // Re-login tenant A (token may have expired in long suites)
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: tenantA.email,
          password: 'Integ@12345',
        });
      const loginToken = loginRes.body.data.accessToken;

      const selectRes = await request(app)
        .post('/api/v1/auth/select-tenant')
        .set('Authorization', `Bearer ${loginToken}`)
        .send({ tenantId: tenantA.id });
      tenantA.token = selectRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(200);

      const ids = res.body.data.map((c) => c.id);
      expect(ids).not.toContain(tenantB.customerId);
    });

    it('Tenant A cannot access Tenant B customer by ID', async () => {
      await request(app)
        .get(`/api/v1/customers/${tenantB.customerId}`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(404);
    });

    it('Tenant A cannot access Tenant B stats', async () => {
      await request(app)
        .get(`/api/v1/tenants/${tenantB.id}/stats`)
        .set('Authorization', `Bearer ${tenantA.token}`)
        .expect(403);
    });
  });

  // ─── Error Scenarios ──────────────────────────

  describe('Error Scenarios', () => {
    it('404 — unknown route', async () => {
      const res = await request(app)
        .get('/api/v1/nonexistent')
        .expect(404);

      expect(res.body.error).toBeDefined();
    });

    it('401 — protected route without auth', async () => {
      await request(app)
        .get('/api/v1/customers')
        .expect(401);
    });
  });

  // ─── Cleanup both tenants ─────────────────────

  afterAll(async () => {
    await cleanupTenant(tenantA.id);
    await cleanupTenant(tenantB.id);
  });
});
