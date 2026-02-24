/**
 * @file customer.service.js
 * @description Customer CRUD business logic.
 */

const prisma = require('../config/db');
const { sanitizeEmail, formatPhoneE164, paginatedResponse } = require('../utils/formatters');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Helpers ───── */

async function checkUniqueEmail(tenantId, email, excludeId = null) {
  const where = { tenantId, email };
  if (excludeId) where.NOT = { id: excludeId };
  const existing = await prisma.customer.findFirst({ where });
  if (existing) {
    throw new ConflictError('A customer with this email already exists in your tenant');
  }
}

async function checkUniquePhone(tenantId, phone, excludeId = null) {
  const where = { tenantId, phone };
  if (excludeId) where.NOT = { id: excludeId };
  const existing = await prisma.customer.findFirst({ where });
  if (existing) {
    throw new ConflictError('A customer with this phone already exists in your tenant');
  }
}

/* ───── Service methods ───── */

/**
 * Create a single customer.
 */
async function createCustomer(tenantId, data) {
  const email = sanitizeEmail(data.email);
  const phone = formatPhoneE164(data.phone);

  await checkUniqueEmail(tenantId, email);
  await checkUniquePhone(tenantId, phone);

  const customer = await prisma.customer.create({
    data: {
      tenantId,
      fullName: data.fullName.trim(),
      email,
      phone,
      address: data.address || null,
    },
  });

  logger.info('Customer created', { tenantId, customerId: customer.id });
  return customer;
}

/**
 * List customers with search, pagination, sorting.
 */
async function getCustomers(tenantId, { q, page = 1, limit = 20, sort = '-createdAt' }) {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const where = { tenantId };

  // Search across fullName, phone, email
  if (q && q.trim()) {
    const search = q.trim();
    where.OR = [
      { fullName: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  // Sort
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  const orderBy = { [field]: desc ? 'desc' : 'asc' };

  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    prisma.customer.findMany({ where, orderBy, skip, take: limitNum }),
    prisma.customer.count({ where }),
  ]);

  return paginatedResponse(data, total, pageNum, limitNum);
}

/**
 * Get single customer by ID (with tenant isolation).
 */
async function getCustomerById(tenantId, customerId) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer || customer.tenantId !== tenantId) {
    throw new NotFoundError('Customer');
  }

  return customer;
}

/**
 * Update a customer.
 */
async function updateCustomer(tenantId, customerId, data) {
  // Verify ownership
  const existing = await getCustomerById(tenantId, customerId);

  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName.trim();
  if (data.address !== undefined) updateData.address = data.address;

  if (data.email !== undefined) {
    const email = sanitizeEmail(data.email);
    await checkUniqueEmail(tenantId, email, customerId);
    updateData.email = email;
  }

  if (data.phone !== undefined) {
    const phone = formatPhoneE164(data.phone);
    await checkUniquePhone(tenantId, phone, customerId);
    updateData.phone = phone;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError('No fields to update');
  }

  const updated = await prisma.customer.update({
    where: { id: customerId },
    data: updateData,
  });

  logger.info('Customer updated', { tenantId, customerId });
  return updated;
}

/**
 * Delete a customer.
 */
async function deleteCustomer(tenantId, customerId) {
  // Verify ownership first
  await getCustomerById(tenantId, customerId);

  await prisma.customer.delete({ where: { id: customerId } });
  logger.info('Customer deleted', { tenantId, customerId });
}

/**
 * Bulk create customers.
 */
async function bulkCreateCustomers(tenantId, dataArray) {
  // Validate duplicates within the array
  const emails = new Set();
  const phones = new Set();

  const prepared = dataArray.map((item, idx) => {
    const email = sanitizeEmail(item.email);
    const phone = formatPhoneE164(item.phone);

    if (emails.has(email)) {
      throw new ConflictError(`Duplicate email "${email}" at index ${idx}`);
    }
    if (phones.has(phone)) {
      throw new ConflictError(`Duplicate phone "${phone}" at index ${idx}`);
    }
    emails.add(email);
    phones.add(phone);

    return {
      tenantId,
      fullName: item.fullName.trim(),
      email,
      phone,
      address: item.address || null,
    };
  });

  const result = await prisma.customer.createMany({
    data: prepared,
    skipDuplicates: true,
  });

  logger.info('Bulk customers created', { tenantId, count: result.count });
  return { createdCount: result.count };
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  bulkCreateCustomers,
};
