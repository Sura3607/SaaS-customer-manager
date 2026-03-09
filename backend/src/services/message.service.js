/**
 * @file message.service.js
 * @description Messaging business logic — send SMS/Email (single + batch), logs.
 */

const prisma = require('../config/db');
const twilioService = require('./twilio.service');
const sendgridService = require('./sendgrid.service');
const customerService = require('./customer.service');
const { paginatedResponse } = require('../utils/formatters');
const { NotFoundError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Batch helper ───── */

const BATCH_CHUNK_SIZE = 10; // Send up to 10 concurrently per chunk (respects provider rate limits)

/**
 * Process items in parallel chunks to balance speed and rate-limit compliance.
 * @param {Array} items - Array of items to process
 * @param {Function} processFn - Async function for each item, returns result
 * @returns {Promise<{queued: number, failed: number, details: Array}>}
 */
async function processInChunks(items, processFn) {
  const results = { queued: 0, failed: 0, total: items.length, details: [] };

  for (let i = 0; i < items.length; i += BATCH_CHUNK_SIZE) {
    const chunk = items.slice(i, i + BATCH_CHUNK_SIZE);
    const settled = await Promise.allSettled(chunk.map(processFn));

    for (let j = 0; j < settled.length; j++) {
      const item = chunk[j];
      if (settled[j].status === 'fulfilled') {
        results.queued++;
        results.details.push({ customerId: item.id, ...settled[j].value });
      } else {
        results.failed++;
        results.details.push({ customerId: item.id, status: 'FAILED', error: settled[j].reason?.message || 'Unknown error' });
      }
    }
  }

  return results;
}

/* ═══════════════════════════════════════════
   SMS
   ═══════════════════════════════════════════ */

/**
 * Send a single SMS to a customer.
 */
async function sendSMS(tenantId, customerId, content) {
  // 1. Fetch customer (verifies tenant ownership)
  const customer = await customerService.getCustomerById(tenantId, customerId);

  if (!customer.phone) {
    throw new ValidationError('Customer does not have a phone number');
  }

  // 2. Create Message record (PENDING)
  const message = await prisma.message.create({
    data: {
      tenantId,
      customerId,
      type: 'SMS',
      content,
      status: 'PENDING',
      recipientPhone: customer.phone,
    },
  });

  // 3. Call Twilio
  let providerResult;
  let finalStatus = 'FAILED';
  let errorReason = null;

  try {
    providerResult = await twilioService.sendSMS(customer.phone, content);
    finalStatus = providerResult.status || 'SENT';
  } catch (err) {
    errorReason = err.message;
    logger.error('SMS send failed', { messageId: message.id, error: err.message });
  }

  // 4. Update Message status
  await prisma.message.update({
    where: { id: message.id },
    data: {
      status: finalStatus,
      sentAt: finalStatus !== 'FAILED' ? new Date() : null,
    },
  });

  // 5. Create MessageLog
  await prisma.messageLog.create({
    data: {
      messageId: message.id,
      tenantId,
      customerId,
      status: finalStatus,
      providerMessageId: providerResult?.messageId || null,
      providerResponse: providerResult || null,
      errorReason,
    },
  });

  logger.info('SMS processed', { messageId: message.id, status: finalStatus });

  return { messageId: message.id, status: finalStatus };
}

/**
 * Send SMS to multiple customers.
 */
async function sendBatchSMS(tenantId, customerIds, content) {
  // Verify all customers belong to tenant
  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds }, tenantId },
  });

  if (customers.length !== customerIds.length) {
    throw new ValidationError('Some customer IDs are invalid or do not belong to your tenant');
  }

  const results = await processInChunks(customers, async (customer) => {
    return sendSMS(tenantId, customer.id, content);
  });

  logger.info('Batch SMS completed', { tenantId, queued: results.queued, failed: results.failed });
  return results;
}

/* ═══════════════════════════════════════════
   EMAIL
   ═══════════════════════════════════════════ */

/**
 * Send a single email to a customer.
 */
async function sendEmail(tenantId, customerId, subject, content) {
  const customer = await customerService.getCustomerById(tenantId, customerId);

  if (!customer.email) {
    throw new ValidationError('Customer does not have an email address');
  }

  // Create Message record
  const message = await prisma.message.create({
    data: {
      tenantId,
      customerId,
      type: 'EMAIL',
      content,
      subject,
      status: 'PENDING',
      recipientEmail: customer.email,
    },
  });

  let providerResult;
  let finalStatus = 'FAILED';
  let errorReason = null;

  try {
    providerResult = await sendgridService.sendEmail(customer.email, subject, content);
    finalStatus = providerResult.status || 'SENT';
  } catch (err) {
    errorReason = err.message;
    logger.error('Email send failed', { messageId: message.id, error: err.message });
  }

  await prisma.message.update({
    where: { id: message.id },
    data: {
      status: finalStatus,
      sentAt: finalStatus !== 'FAILED' ? new Date() : null,
    },
  });

  await prisma.messageLog.create({
    data: {
      messageId: message.id,
      tenantId,
      customerId,
      status: finalStatus,
      providerMessageId: providerResult?.messageId || null,
      providerResponse: providerResult || null,
      errorReason,
    },
  });

  logger.info('Email processed', { messageId: message.id, status: finalStatus });
  return { messageId: message.id, status: finalStatus };
}

/**
 * Send email to multiple customers.
 */
async function sendBatchEmail(tenantId, customerIds, subject, content) {
  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds }, tenantId },
  });

  if (customers.length !== customerIds.length) {
    throw new ValidationError('Some customer IDs are invalid or do not belong to your tenant');
  }

  const results = await processInChunks(customers, async (customer) => {
    return sendEmail(tenantId, customer.id, subject, content);
  });

  logger.info('Batch email completed', { tenantId, queued: results.queued, failed: results.failed });
  return results;
}

/* ═══════════════════════════════════════════
   LOGS
   ═══════════════════════════════════════════ */

/**
 * Get message logs with filtering + pagination.
 */
async function getMessageLogs(tenantId, { type, status, startDate, endDate, page = 1, limit = 20 }) {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  const where = { tenantId };

  if (status) where.status = status;

  // Filter by message type via relation
  if (type) {
    where.message = { type };
  }

  // Date range filter
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(startDate);
    if (endDate) where.timestamp.lte = new Date(endDate);
  }

  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    prisma.messageLog.findMany({
      where,
      include: {
        message: {
          select: { id: true, type: true, content: true, subject: true, recipientPhone: true, recipientEmail: true },
        },
        customer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.messageLog.count({ where }),
  ]);

  return paginatedResponse(data, total, pageNum, limitNum);
}

/**
 * Get a single message log by ID (with tenant isolation).
 */
async function getMessageLogById(tenantId, logId) {
  const log = await prisma.messageLog.findUnique({
    where: { id: logId },
    include: {
      message: true,
      customer: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
    },
  });

  if (!log || log.tenantId !== tenantId) {
    throw new NotFoundError('MessageLog');
  }

  return log;
}

/* ═══════════════════════════════════════════
   WEBHOOK PROCESSORS
   ═══════════════════════════════════════════ */

/**
 * Process Twilio status callback and update MessageLog.
 */
async function processTwilioWebhook(payload) {
  const parsed = twilioService.handleWebhook(payload);

  if (!parsed.providerMessageId) {
    logger.warn('Twilio webhook: missing SID');
    return { updated: false };
  }

  // Find log by provider SID
  const log = await prisma.messageLog.findFirst({
    where: { providerMessageId: parsed.providerMessageId },
  });

  if (!log) {
    logger.warn('Twilio webhook: no matching MessageLog', { sid: parsed.providerMessageId });
    return { updated: false };
  }

  // Update log + message status
  await prisma.$transaction([
    prisma.messageLog.update({
      where: { id: log.id },
      data: {
        status: parsed.status,
        errorReason: parsed.errorReason,
        providerResponse: parsed.rawPayload,
      },
    }),
    prisma.message.update({
      where: { id: log.messageId },
      data: {
        status: parsed.status === 'BOUNCED' ? 'FAILED' : parsed.status,
        sentAt: parsed.status === 'DELIVERED' ? new Date() : undefined,
      },
    }),
  ]);

  logger.info('Twilio webhook processed', { logId: log.id, newStatus: parsed.status });
  return { updated: true, logId: log.id, status: parsed.status };
}

/**
 * Process SendGrid event webhook and update MessageLog(s).
 */
async function processSendgridWebhook(events) {
  const parsedEvents = sendgridService.handleWebhook(events);
  const results = [];

  for (const parsed of parsedEvents) {
    if (!parsed.providerMessageId) continue;

    // SendGrid sg_message_id can have ".filter..." suffix — use startsWith
    const cleanId = parsed.providerMessageId.split('.')[0];

    const log = await prisma.messageLog.findFirst({
      where: { providerMessageId: { startsWith: cleanId } },
    });

    if (!log) {
      results.push({ sgMessageId: parsed.providerMessageId, updated: false });
      continue;
    }

    await prisma.$transaction([
      prisma.messageLog.update({
        where: { id: log.id },
        data: {
          status: parsed.status,
          errorReason: parsed.reason,
          providerResponse: parsed.rawPayload,
        },
      }),
      prisma.message.update({
        where: { id: log.messageId },
        data: {
          status: parsed.status === 'BOUNCED' ? 'FAILED' : parsed.status,
        },
      }),
    ]);

    results.push({ logId: log.id, updated: true, status: parsed.status });
  }

  logger.info('SendGrid webhook processed', { eventsCount: parsedEvents.length });
  return results;
}

module.exports = {
  sendSMS,
  sendBatchSMS,
  sendEmail,
  sendBatchEmail,
  getMessageLogs,
  getMessageLogById,
  processTwilioWebhook,
  processSendgridWebhook,
};
