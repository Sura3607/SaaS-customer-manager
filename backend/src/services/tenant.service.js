/**
 * @file tenant.service.js
 * @description Tenant management business logic — register, get, update, stats.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const { generateSlug, sanitizeEmail } = require('../utils/formatters');
const { AppError, ConflictError, NotFoundError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;

/**
 * Register a new tenant with an admin user (public endpoint).
 * If the email already exists, reuse the existing User.
 * Creates Tenant + TenantMembership (ADMIN) in a single transaction.
 */
async function register({ companyName, adminEmail, adminPassword, adminFullName, phone }) {
  if (!companyName || !adminEmail || !adminPassword) {
    throw new ValidationError('companyName, adminEmail and adminPassword are required');
  }

  const email = sanitizeEmail(adminEmail);

  // Generate unique slug
  let slug = generateSlug(companyName);
  const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  // Check if email is already registered
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(
      'This email address is already registered. Please log in instead.',
      409,
      'EMAIL_ALREADY_REGISTERED'
    );
  }

  // Check if phone is already registered by another account
  if (phone) {
    const existingPhone = await prisma.tenant.findFirst({ where: { phone } });
    if (existingPhone) {
      throw new AppError(
        'This phone number is already registered. Please use a different phone number.',
        409,
        'PHONE_ALREADY_REGISTERED'
      );
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // Create tenant + user (if new) + membership in transaction
  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        companyName,
        slug,
        phone: phone || null,
      },
    });

    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: adminFullName || 'Admin',
      },
    });

    const membership = await tx.tenantMembership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        role: 'ADMIN',
      },
    });

    return { tenant, user, membership };
  });

  logger.info('Tenant registered', { tenantId: result.tenant.id, slug });

  return {
    tenant: {
      id: result.tenant.id,
      companyName: result.tenant.companyName,
      slug: result.tenant.slug,
      phone: result.tenant.phone,
      createdAt: result.tenant.createdAt,
    },
    admin: {
      id: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      role: result.membership.role,
    },
  };
}

/**
 * Create a new tenant for an already-authenticated user.
 * No email/password required — the user account already exists.
 */
async function createTenantForUser(userId, { companyName, phone }) {
  if (!companyName) {
    throw new ValidationError('companyName is required');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User');
  }

  // Generate unique slug
  let slug = generateSlug(companyName);
  const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  // Check if phone is already registered (if provided)
  if (phone) {
    const existingPhone = await prisma.tenant.findFirst({ where: { phone } });
    if (existingPhone) {
      throw new AppError(
        'This phone number is already registered. Please use a different phone number.',
        409,
        'PHONE_ALREADY_REGISTERED'
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { companyName, slug, phone: phone || null },
    });

    const membership = await tx.tenantMembership.create({
      data: { userId: user.id, tenantId: tenant.id, role: 'ADMIN' },
    });

    return { tenant, membership };
  });

  logger.info('Tenant created for existing user', { tenantId: result.tenant.id, userId });

  return {
    id: result.tenant.id,
    companyName: result.tenant.companyName,
    slug: result.tenant.slug,
    phone: result.tenant.phone,
    role: result.membership.role,
    createdAt: result.tenant.createdAt,
  };
}

/**
 * Get tenant by ID (with tenant isolation).
 */
async function getTenant(tenantId) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: { memberships: true, customers: true },
      },
    },
  });
  if (!tenant) {
    throw new NotFoundError('Tenant');
  }
  return {
    id: tenant.id,
    companyName: tenant.companyName,
    slug: tenant.slug,
    phone: tenant.phone,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
    userCount: tenant._count.memberships,
    customerCount: tenant._count.customers,
  };
}

/**
 * Update tenant info (companyName, phone).
 */
async function updateTenant(tenantId, data) {
  // Verify tenant exists
  const existing = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!existing) {
    throw new NotFoundError('Tenant');
  }

  const updateData = {};
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.phone !== undefined) updateData.phone = data.phone;

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError('No fields to update');
  }

  const updated = await prisma.tenant.update({
    where: { id: tenantId },
    data: updateData,
  });

  logger.info('Tenant updated', { tenantId });

  return {
    id: updated.id,
    companyName: updated.companyName,
    slug: updated.slug,
    phone: updated.phone,
    updatedAt: updated.updatedAt,
  };
}

/**
 * Get tenant statistics (counts of customers, messages, users).
 */
async function getTenantStats(tenantId) {
  const [customerCount, messageCount, userCount] = await Promise.all([
    prisma.customer.count({ where: { tenantId } }),
    prisma.message.count({ where: { tenantId } }),
    prisma.tenantMembership.count({ where: { tenantId } }),
  ]);

  return {
    tenantId,
    customers: customerCount,
    messages: messageCount,
    users: userCount,
  };
}


/**
 * Get chart data for dashboard:
 * - Monthly SMS + Email counts for the last 12 months
 * - Daily SMS + Email breakdown for current month
 */
async function getChartData(tenantId) {
  const now = new Date();

  // ── 12-month range ──────────────────────────────────────────
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Fetch all messages in the last 12 months
  const messages = await prisma.message.findMany({
    where: {
      tenantId,
      createdAt: { gte: twelveMonthsAgo },
    },
    select: { type: true, createdAt: true },
  });

  // Build monthly buckets (last 12 months)
  const monthlyMap = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap[key] = { month: label, SMS: 0, Email: 0 };
  }

  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyMap[key]) {
      if (msg.type === 'SMS') monthlyMap[key].SMS++;
      else if (msg.type === 'EMAIL') monthlyMap[key].Email++;
    }
  }

  const monthly = Object.values(monthlyMap);

  // ── Current month daily breakdown ───────────────────────────
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthMessages = await prisma.message.findMany({
    where: {
      tenantId,
      createdAt: { gte: monthStart },
    },
    select: { type: true, createdAt: true },
  });

  // Build daily buckets for current month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyMap = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyMap[d] = { day: `${d}`, SMS: 0, Email: 0 };
  }
  for (const msg of currentMonthMessages) {
    const day = new Date(msg.createdAt).getDate();
    if (dailyMap[day]) {
      if (msg.type === 'SMS') dailyMap[day].SMS++;
      else if (msg.type === 'EMAIL') dailyMap[day].Email++;
    }
  }

  // Return only days that have data OR compact to weeks
  const daily = Object.values(dailyMap);

  // Weekly summary for current month (cleaner for bar chart)
  const weekly = [
    { week: 'Week 1', SMS: 0, Email: 0 },
    { week: 'Week 2', SMS: 0, Email: 0 },
    { week: 'Week 3', SMS: 0, Email: 0 },
    { week: 'Week 4+', SMS: 0, Email: 0 },
  ];
  for (const msg of currentMonthMessages) {
    const day = new Date(msg.createdAt).getDate();
    const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
    if (msg.type === 'SMS') weekly[weekIdx].SMS++;
    else if (msg.type === 'EMAIL') weekly[weekIdx].Email++;
  }

  return { monthly, weekly, currentMonth: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }) };
}

module.exports = { register, createTenantForUser, getTenant, updateTenant, getTenantStats, getChartData };