/**
 * @file twilio.service.js
 * @description Twilio SMS service — send single/batch SMS, handle webhooks.
 */

const { getTwilioClient, TWILIO_PHONE_NUMBER } = require('../config/providers');
const { formatPhoneE164 } = require('../utils/formatters');
const { AppError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Status mapping ───── */

const TWILIO_STATUS_MAP = {
  queued: 'PENDING',
  sent: 'SENT',
  delivered: 'DELIVERED',
  undelivered: 'FAILED',
  failed: 'FAILED',
};

/**
 * Send a single SMS via Twilio.
 * @param {string} toNumber - Recipient phone number
 * @param {string} content  - SMS body (max ~1600 chars, 160 per segment)
 * @returns {Promise<{messageId: string, status: string}>}
 */
async function sendSMS(toNumber, content) {
  const client = getTwilioClient();
  if (!client) {
    throw new AppError('Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER.', 503, 'PROVIDER_NOT_CONFIGURED');
  }

  if (!toNumber) throw new ValidationError('Phone number is required');
  if (!content || !content.trim()) throw new ValidationError('SMS content is required');

  const to = formatPhoneE164(toNumber);

  try {
    const message = await client.messages.create({
      body: content,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    logger.info('SMS sent via Twilio', { sid: message.sid, to, status: message.status });

    return {
      messageId: message.sid,
      status: TWILIO_STATUS_MAP[message.status] || message.status,
    };
  } catch (error) {
    logger.error('Twilio sendSMS failed', { to, error: error.message, code: error.code });

    // Twilio error codes: https://www.twilio.com/docs/api/errors
    if (error.code === 21211 || error.code === 21614) {
      throw new ValidationError(`Invalid phone number: ${to}`);
    }
    if (error.code === 20003) {
      throw new AppError('Twilio authentication failed. Check credentials.', 503, 'PROVIDER_AUTH_ERROR');
    }
    if (error.code === 21610) {
      throw new AppError('Recipient has opted out of SMS.', 400, 'SMS_OPT_OUT');
    }

    throw new AppError(
      `Failed to send SMS: ${error.message}`,
      502,
      'SMS_SEND_FAILED'
    );
  }
}

/**
 * Send SMS to multiple numbers.
 * @param {string[]} numbers - Array of phone numbers
 * @param {string} content   - SMS body
 * @returns {Promise<{success: Array, failed: Array}>}
 */
async function sendBatchSMS(numbers, content) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new ValidationError('numbers array is required');
  }

  const success = [];
  const failed = [];

  for (const number of numbers) {
    try {
      const result = await sendSMS(number, content);
      success.push({ number, messageId: result.messageId, status: result.status });
    } catch (error) {
      failed.push({ number, error: error.message });
      logger.warn('Batch SMS failed for number', { number, error: error.message });
    }
  }

  logger.info('Batch SMS completed', { total: numbers.length, success: success.length, failed: failed.length });

  return { success, failed };
}

/**
 * Parse Twilio status callback webhook payload.
 * @param {object} payload - Twilio webhook body (form-encoded parsed by Express)
 * @returns {object} Parsed data for MessageLog update
 */
function handleWebhook(payload) {
  const {
    MessageSid,
    MessageStatus,
    To,
    From,
    ErrorCode,
    ErrorMessage,
  } = payload;

  if (!MessageSid || !MessageStatus) {
    throw new ValidationError('Invalid Twilio webhook payload');
  }

  const mapped = {
    providerMessageId: MessageSid,
    status: TWILIO_STATUS_MAP[MessageStatus] || MessageStatus,
    to: To || null,
    from: From || null,
    errorCode: ErrorCode || null,
    errorReason: ErrorMessage || null,
    rawPayload: payload,
  };

  logger.info('Twilio webhook received', {
    sid: MessageSid,
    status: MessageStatus,
    mapped: mapped.status,
  });

  return mapped;
}

module.exports = { sendSMS, sendBatchSMS, handleWebhook, TWILIO_STATUS_MAP };
