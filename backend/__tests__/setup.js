/**
 * @file setup.js
 * @description Test helper — provides a configured Supertest agent and
 * shared utilities (login, cleanup) that all test suites can reuse.
 *
 * Uses the REAL database (saas_db). Tests create their own tenant to
 * avoid polluting seed data, and clean up after themselves.
 */

const DEFAULT_TEST_DATABASE_URL = 'mysql://saas_user:saas_password123@localhost:3306/saas_db';
const PLACEHOLDER_DATABASE_URLS = new Set([
  'mysql://user:password@localhost:3306/saas_db',
]);

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

if (!process.env.DATABASE_URL || PLACEHOLDER_DATABASE_URLS.has(process.env.DATABASE_URL)) {
  process.env.DATABASE_URL = DEFAULT_TEST_DATABASE_URL;
}

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
 * Returns { tenantId, tenantSlug, user, accessToken, refreshToken }.
 */
async function registerAndLogin() {
  // Register
  const regRes = await request(app)
    .post('/api/v1/tenants/register')
    .send(TEST_TENANT)
    .expect(201);

  const tenantId = regRes.body.data.tenant.id;
  const tenantSlug = regRes.body.data.tenant.slug;

  // Login (no tenantSlug needed)
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: TEST_TENANT.adminEmail,
      password: TEST_TENANT.adminPassword,
    })
    .expect(200);

  const loginToken = loginRes.body.data.accessToken;

  // Select tenant to get a tenant-scoped token
  const selectRes = await request(app)
    .post('/api/v1/auth/select-tenant')
    .set('Authorization', `Bearer ${loginToken}`)
    .send({ tenantId })
    .expect(200);

  return {
    tenantId,
    tenantSlug,
    user: loginRes.body.data.user,
    accessToken: selectRes.body.data.accessToken,
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
    // Get user IDs via memberships, then delete their refresh tokens
    const memberships = await prisma.tenantMembership.findMany({
      where: { tenantId },
      select: { userId: true },
    });
    const userIds = memberships.map((m) => m.userId);
    await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.tenantMembership.deleteMany({ where: { tenantId } });
    // Only delete users that have no other memberships
    for (const uid of userIds) {
      const remaining = await prisma.tenantMembership.count({ where: { userId: uid } });
      if (remaining === 0) {
        await prisma.user.delete({ where: { id: uid } }).catch(() => {});
      }
    }
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
