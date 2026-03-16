/**
 * @file messages.routes.js
 * @description Messaging routes (SMS, Email, Webhooks).
 * Endpoints: POST /sms, POST /email, POST /sms/batch, POST /email/batch
 * POST /speedsms/webhook, POST /sendgrid/webhook
 */

const { Router } = require('express');
const messagesController = require('../controllers/messages.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');
const { messagingLimiter } = require('../middlewares/ratelimit.middleware');
const {
  validate,
  sendSMSSchema,
  batchSMSSchema,
  sendEmailSchema,
  batchEmailSchema,
} = require('../validators/message.validator');
const {
  verifySendgridSignature,
  logWebhookRequest,
} = require('../middlewares/webhook.middleware');

const router = Router();

// Protected messaging endpoints (auth + tenant + rate limit)
router.post('/sms', authenticate, tenantIsolation, messagingLimiter, validate(sendSMSSchema), messagesController.sendSMS);
router.post('/sms/batch', authenticate, tenantIsolation, messagingLimiter, validate(batchSMSSchema), messagesController.sendBatchSMS);
router.post('/email', authenticate, tenantIsolation, messagingLimiter, validate(sendEmailSchema), messagesController.sendEmail);
router.post('/email/batch', authenticate, tenantIsolation, messagingLimiter, validate(batchEmailSchema), messagesController.sendBatchEmail);

// Public webhooks (no auth — providers call these, secured via signature verification)
router.post('/speedsms/webhook', logWebhookRequest('SpeedSMS'), messagesController.speedsmsWebhook);
router.post('/sendgrid/webhook', logWebhookRequest('SendGrid'), verifySendgridSignature, messagesController.sendgridWebhook);

module.exports = router;