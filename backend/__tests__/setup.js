/**
 * @file setup.js
 * @description Test helper — provides a configured Supertest agent and
 * shared utilities (login, cleanup) that all test suites can reuse.
 *
 * Uses the REAL database (saas_db). Tests create their own tenant to
 * avoid polluting seed data, and clean up after themselves.
 */

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

// ──────────────────────────────────────────────
// Helper: register a fresh tenant + admin user
// ──────────────────────────────────────────────

const TEST_TENANT = {
  companyName: `TestCorp_${Date.now()}`,
  adminEmail: `testadmin_${Date.now()}@test.com`,
  adminPassword: 'Test@12345',
  phone: '+84900000001',
};

/**
 * Register a new tenant and login as admin.
 * Returns { tenant, user, accessToken, refreshToken }.
 */
async function registerAndLogin() {
  // Register
  const regRes = await request(app)
    .post('/api/v1/tenants/register')
    .send(TEST_TENANT)
    .expect(201);

  const tenantId = regRes.body.data.tenant.id;
  const tenantSlug = regRes.body.data.tenant.slug;

  // Login
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: TEST_TENANT.adminEmail,
      password: TEST_TENANT.adminPassword,
      tenantSlug,
    })
    .expect(200);

  return {
    tenantId,
    tenantSlug,
    user: loginRes.body.data.user,
    accessToken: loginRes.body.data.accessToken,
    refreshToken: loginRes.body.data.refreshToken,
  };
}

// ──────────────────────────────────────────────
// Helper: cleanup test tenant + all related data
// ──────────────────────────────────────────────

async function cleanupTenant(tenantId) {
  if (!tenantId) return;
  try {
    // Delete in order respecting FK constraints
    await prisma.messageLog.deleteMany({ where: { message: { tenantId } } });
    await prisma.message.deleteMany({ where: { tenantId } });
    await prisma.customer.deleteMany({ where: { tenantId } });
    await prisma.auditLog.deleteMany({ where: { tenantId } });
    await prisma.refreshToken.deleteMany({ where: { user: { tenantId } } });
    await prisma.user.deleteMany({ where: { tenantId } });
    await prisma.tenant.delete({ where: { id: tenantId } });
  } catch (_) {
    // Ignore — tenant may have already been cleaned up
  }
}

// ──────────────────────────────────────────────
// Disconnect Prisma after all tests
// ──────────────────────────────────────────────

afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = {
  app,
  prisma,
  request,
  TEST_TENANT,
  registerAndLogin,
  cleanupTenant,
};
