/**
 * @file messages.controller.js
 * @description Messaging controller — SMS, Email, Webhooks, Logs.
 */

const messageService = require('../services/message.service');
const logger = require('../utils/logger');

/* ───── SMS ───── */

async function sendSMS(req, res, next) {
  try {
    const { customerId, content } = req.body;
    const result = await messageService.sendSMS(req.tenantId, customerId, content);
    res.status(201).json({ success: true, message: 'SMS processed', data: result });
  } catch (error) {
    next(error);
  }
}

async function sendBatchSMS(req, res, next) {
  try {
    const { customerIds, content } = req.body;
    const result = await messageService.sendBatchSMS(req.tenantId, customerIds, content);
    res.status(201).json({ success: true, message: 'Batch SMS processed', data: result });
  } catch (error) {
    next(error);
  }
}

/* ───── Email ───── */

async function sendEmail(req, res, next) {
  try {
    const { customerId, subject, content } = req.body;
    const result = await messageService.sendEmail(req.tenantId, customerId, subject, content);
    res.status(201).json({ success: true, message: 'Email processed', data: result });
  } catch (error) {
    next(error);
  }
}

async function sendBatchEmail(req, res, next) {
  try {
    const { customerIds, subject, content } = req.body;
    const result = await messageService.sendBatchEmail(req.tenantId, customerIds, subject, content);
    res.status(201).json({ success: true, message: 'Batch email processed', data: result });
  } catch (error) {
    next(error);
  }
}

/* ───── Logs ───── */

async function getLogs(req, res, next) {
  try {
    const result = await messageService.getMessageLogs(req.tenantId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getLogById(req, res, next) {
  try {
    const log = await messageService.getMessageLogById(req.tenantId, req.params.id);
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
}

/* ───── Webhooks (public, no auth) ───── */

async function speedsmsWebhook(req, res, next) {
  // Respond 200 IMMEDIATELY — SpeedSMS retries on non-2xx or timeout
  res.status(200).json({ received: true });

  // Process asynchronously (fire-and-forget)
  try {
    await messageService.processSpeedsmsWebhook(req.body);
  } catch (error) {
    // Log but don't affect the already-sent response
    logger.error('SpeedSMS webhook async processing failed', { error: error.message });
  }
}

async function sendgridWebhook(req, res, next) {
  // Respond 200 IMMEDIATELY — SendGrid retries on non-2xx or timeout
  res.status(200).json({ received: true });

  // Process asynchronously (fire-and-forget)
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];
    await messageService.processSendgridWebhook(events);
  } catch (error) {
    logger.error('SendGrid webhook async processing failed', { error: error.message });
  }
}


async function deleteMessage(req, res, next) {
  try {
    await messageService.deleteMessage(req.tenantId, req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendSMS,
  sendBatchSMS,
  sendEmail,
  sendBatchEmail,
  getLogs,
  getLogById,
  speedsmsWebhook,
  sendgridWebhook,
  deleteMessage,
};