/**
 * @file webhook.middleware.js
 * @description Webhook signature verification middleware for SpeedSMS & SendGrid.
 * Phase 9 — Webhook Security & Processing.
 */

const { env } = require('../config/env');
const logger = require('../utils/logger');

/* ═══════════════════════════════════════════
   SENDGRID WEBHOOK SIGNATURE VERIFICATION
   ═══════════════════════════════════════════
   SendGrid signs webhooks using ECDSA with a verification key.
   Reference: https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features
*/

/**
 * Middleware: verify SendGrid Event Webhook signature.
 * Requires SENDGRID_WEBHOOK_VERIFICATION_KEY env variable.
 * In development or if key is not set, skip verification with a warning.
 */
function verifySendgridSignature(req, res, next) {
  const verificationKey = env.SENDGRID_WEBHOOK_VERIFICATION_KEY;

  // If no verification key configured, skip (dev mode)
  if (!verificationKey || verificationKey === 'your_verification_key_here') {
    logger.warn('SendGrid webhook signature verification SKIPPED — SENDGRID_WEBHOOK_VERIFICATION_KEY not configured');
    return next();
  }

  try {
    const { EventWebhook, EventWebhookHeader } = require('@sendgrid/eventwebhook');

    const publicKey = verificationKey;
    const signature = req.headers[EventWebhookHeader.SIGNATURE()] || req.headers['x-twilio-email-event-webhook-signature'];
    const timestamp = req.headers[EventWebhookHeader.TIMESTAMP()] || req.headers['x-twilio-email-event-webhook-timestamp'];

    if (!signature || !timestamp) {
      logger.warn('SendGrid webhook: missing signature or timestamp headers');
      return res.status(403).json({ error: 'Missing SendGrid signature headers' });
    }

    // SendGrid requires the exact raw body bytes for ECDSA verification.
    // req.rawBody is captured by express.json({ verify }) in app.js before parsing.
    const rawBody = req.rawBody;
    if (!rawBody) {
      logger.error('SendGrid webhook: rawBody not available — verify express.json({ verify }) is configured');
      return res.status(500).json({ error: 'Server misconfiguration: raw body not captured' });
    }

    const eventWebhook = new EventWebhook();
    const ecPublicKey = eventWebhook.convertPublicKeyToECDSA(publicKey);
    const isValid = eventWebhook.verifySignature(ecPublicKey, rawBody, signature, timestamp);

    if (!isValid) {
      logger.warn('SendGrid webhook: INVALID signature', { ip: req.ip });
      return res.status(403).json({ error: 'Invalid SendGrid signature' });
    }

    logger.debug('SendGrid webhook signature verified');
    next();
  } catch (error) {
    logger.error('SendGrid signature verification error', { error: error.message });
    return res.status(403).json({ error: 'SendGrid signature verification failed' });
  }
}

/* ═══════════════════════════════════════════
   WEBHOOK LOGGING MIDDLEWARE
   ═══════════════════════════════════════════ */

/**
 * Middleware: log incoming webhook requests for debugging.
 */
function logWebhookRequest(provider) {
  return (req, res, next) => {
    logger.info(`${provider} webhook received`, {
      provider,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      contentType: req.headers['content-type'],
      bodyKeys: req.body ? Object.keys(req.body) : [],
      bodyLength: req.body ? JSON.stringify(req.body).length : 0,
    });
    next();
  };
}

module.exports = {
  verifySendgridSignature,
  logWebhookRequest,
};
