/**
 * @file webhook.middleware.js
 * @description Webhook signature verification middleware for Twilio & SendGrid.
 * Phase 9 — Webhook Security & Processing.
 */

const { env } = require('../config/env');
const logger = require('../utils/logger');

/* ═══════════════════════════════════════════
   TWILIO SIGNATURE VERIFICATION
   ═══════════════════════════════════════════
   Twilio signs every request using the auth token.
   Reference: https://www.twilio.com/docs/usage/security#validating-requests
*/

/**
 * Middleware: verify Twilio webhook request signature.
 * In development or if TWILIO_AUTH_TOKEN is not set, skip verification with a warning.
 */
function verifyTwilioSignature(req, res, next) {
  const authToken = env.TWILIO_AUTH_TOKEN;

  // If no auth token configured, skip verification (dev mode)
  if (!authToken || authToken === 'your_auth_token_here') {
    logger.warn('Twilio webhook signature verification SKIPPED — TWILIO_AUTH_TOKEN not configured');
    return next();
  }

  try {
    // Lazy-require twilio to avoid loading if not needed
    const twilio = require('twilio');

    const signature = req.headers['x-twilio-signature'];
    if (!signature) {
      logger.warn('Twilio webhook: missing x-twilio-signature header');
      return res.status(403).json({ error: 'Missing Twilio signature' });
    }

    // Build the full URL Twilio used to sign the request
    // Must match exactly what Twilio sees (protocol + host + path)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    // Twilio sends form-encoded body for status callbacks
    const params = req.body || {};

    const isValid = twilio.validateRequest(authToken, signature, fullUrl, params);

    if (!isValid) {
      logger.warn('Twilio webhook: INVALID signature', {
        url: fullUrl,
        signature,
        ip: req.ip,
      });
      return res.status(403).json({ error: 'Invalid Twilio signature' });
    }

    logger.debug('Twilio webhook signature verified', { url: fullUrl });
    next();
  } catch (error) {
    logger.error('Twilio signature verification error', { error: error.message });
    // In case of verification error, reject the request
    return res.status(403).json({ error: 'Twilio signature verification failed' });
  }
}

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

    // SendGrid requires raw body for verification
    // Express already parsed JSON body; we need the raw string
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

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
  verifyTwilioSignature,
  verifySendgridSignature,
  logWebhookRequest,
};
