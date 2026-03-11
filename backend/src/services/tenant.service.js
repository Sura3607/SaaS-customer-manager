/**
 * @file tenant.service.js
 * @description Tenant management business logic — register, get, update, stats.
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const { generateSlug, sanitizeEmail } = require('../utils/formatters');
const { ConflictError, NotFoundError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;

/**
 * Register a new tenant with an admin user (public endpoint).
 * Creates Tenant + first User (role ADMIN) in a single transaction.
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
    // Append short random suffix to avoid collision
    slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // Create tenant + admin user in transaction
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
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    return { tenant, user };
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
      role: result.user.role,
    },
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
        select: { users: true, customers: true },
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
    userCount: tenant._count.users,
    customerCount: tenant._count.customers,
  };
}

/**
 * Update tenant info (companyName, phone, API keys).
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
  if (data.twilioAccountSid !== undefined) updateData.twilioAccountSid = data.twilioAccountSid;
  if (data.twilioAuthToken !== undefined) updateData.twilioAuthToken = data.twilioAuthToken;
  if (data.twilioPhoneNumber !== undefined) updateData.twilioPhoneNumber = data.twilioPhoneNumber;
  if (data.sendgridApiKey !== undefined) updateData.sendgridApiKey = data.sendgridApiKey;
  if (data.sendgridFromEmail !== undefined) updateData.sendgridFromEmail = data.sendgridFromEmail;

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
    twilioAccountSid: updated.twilioAccountSid,
    twilioAuthToken: updated.twilioAuthToken,
    twilioPhoneNumber: updated.twilioPhoneNumber,
    sendgridApiKey: updated.sendgridApiKey,
    sendgridFromEmail: updated.sendgridFromEmail,
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
    prisma.user.count({ where: { tenantId } }),
  ]);

  return {
    tenantId,
    customers: customerCount,
    messages: messageCount,
    users: userCount,
  };
}

module.exports = { register, getTenant, updateTenant, getTenantStats };
