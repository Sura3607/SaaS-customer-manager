/**
 * @file validators.test.js
 * @description Tests for input validation schemas (Joi).
 */

const { app, request, registerAndLogin, cleanupTenant } = require('./setup');

describe('Input Validation', () => {
  let ctx;

  beforeAll(async () => {
    ctx = await registerAndLogin();
  });

  afterAll(async () => {
    await cleanupTenant(ctx.tenantId);
  });

  // ─── Auth Validation ──────────────────────────

  describe('Auth Validation', () => {
    it('should reject login with empty body', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject login with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'notanemail', password: '123456' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject register with short password', async () => {
      const res = await request(app)
        .post('/api/v1/tenants/register')
        .send({
          companyName: 'Short PW Corp',
          adminEmail: 'shortpw@test.com',
          adminPassword: '12',  // too short
          phone: '+84900000002',
        })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject register with missing companyName', async () => {
      const res = await request(app)
        .post('/api/v1/tenants/register')
        .send({
          adminEmail: 'no-company@test.com',
          adminPassword: 'ValidPass123',
        })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });
  });

  // ─── Customer Validation ──────────────────────

  describe('Customer Validation', () => {
    it('should reject customer without fullName', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ email: 'x@test.com', phone: '+84900111222' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject customer with invalid phone', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ fullName: 'Test', email: 'x@test.com', phone: 'abc' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject customer with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ fullName: 'Test', email: 'invalid', phone: '+84900111222' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject bulk create with non-array', async () => {
      const res = await request(app)
        .post('/api/v1/customers/bulk')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ customers: 'notarray' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });
  });

  // ─── Message Validation ───────────────────────

  describe('Message Validation', () => {
    it('should reject SMS without customerId', async () => {
      const res = await request(app)
        .post('/api/v1/messages/sms')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ content: 'Hello' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject email without subject', async () => {
      const res = await request(app)
        .post('/api/v1/messages/email')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ customerId: 'some-id', content: 'Body' })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should reject batch SMS with empty array', async () => {
      const res = await request(app)
        .post('/api/v1/messages/sms/batch')
        .set('Authorization', `Bearer ${ctx.accessToken}`)
        .send({ messages: [] })
        .expect(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
