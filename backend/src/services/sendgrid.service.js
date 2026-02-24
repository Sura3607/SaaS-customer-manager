/**
 * @file sendgrid.service.js
 * @description SendGrid email service — send single/batch email, handle webhooks.
 */

const { getSendGridClient, SENDGRID_FROM_EMAIL } = require('../config/providers');
const { sanitizeEmail } = require('../utils/formatters');
const { AppError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Event mapping ───── */

const SENDGRID_EVENT_MAP = {
  processed: 'PENDING',
  delivered: 'DELIVERED',
  open: 'DELIVERED',
  click: 'DELIVERED',
  bounce: 'BOUNCED',
  dropped: 'FAILED',
  deferred: 'PENDING',
  spamreport: 'FAILED',
  unsubscribe: 'FAILED',
};

/**
 * Send a single email via SendGrid.
 * @param {string} toEmail  - Recipient email address
 * @param {string} subject  - Email subject
 * @param {string} content  - HTML email body
 * @returns {Promise<{messageId: string, status: string}>}
 */
async function sendEmail(toEmail, subject, content) {
  const sgMail = getSendGridClient();
  if (!sgMail) {
    throw new AppError(
      'SendGrid is not configured. Set SENDGRID_API_KEY.',
      503,
      'PROVIDER_NOT_CONFIGURED'
    );
  }

  if (!toEmail) throw new ValidationError('Email address is required');
  if (!subject || !subject.trim()) throw new ValidationError('Email subject is required');
  if (!content || !content.trim()) throw new ValidationError('Email content is required');

  const to = sanitizeEmail(toEmail);

  const msg = {
    to,
    from: SENDGRID_FROM_EMAIL,
    subject: subject.trim(),
    html: content,
  };

  try {
    const [response] = await sgMail.send(msg);

    // SendGrid returns x-message-id in headers
    const messageId =
      response.headers?.['x-message-id'] || response.headers?.['X-Message-Id'] || null;

    logger.info('Email sent via SendGrid', { messageId, to, status: response.statusCode });

    return {
      messageId: messageId || `sg_${Date.now()}`,
      status: 'PENDING', // SendGrid queues then delivers asynchronously
    };
  } catch (error) {
    logger.error('SendGrid sendEmail failed', {
      to,
      error: error.message,
      code: error.code,
      statusCode: error.code,
    });

    if (error.code === 401) {
      throw new AppError('SendGrid authentication failed. Check API key.', 503, 'PROVIDER_AUTH_ERROR');
    }
    if (error.code === 403) {
      throw new AppError('SendGrid forbidden — verify sender identity.', 503, 'PROVIDER_AUTH_ERROR');
    }

    throw new AppError(
      `Failed to send email: ${error.message}`,
      502,
      'EMAIL_SEND_FAILED'
    );
  }
}

/**
 * Send email to multiple recipients.
 * @param {string[]} emails  - Array of email addresses
 * @param {string}   subject - Email subject
 * @param {string}   content - HTML email body
 * @returns {Promise<{success: Array, failed: Array}>}
 */
async function sendBatchEmail(emails, subject, content) {
  if (!Array.isArray(emails) || emails.length === 0) {
    throw new ValidationError('emails array is required');
  }

  const success = [];
  const failed = [];

  for (const email of emails) {
    try {
      const result = await sendEmail(email, subject, content);
      success.push({ email, messageId: result.messageId, status: result.status });
    } catch (error) {
      failed.push({ email, error: error.message });
      logger.warn('Batch email failed for address', { email, error: error.message });
    }
  }

  logger.info('Batch email completed', {
    total: emails.length,
    success: success.length,
    failed: failed.length,
  });

  return { success, failed };
}

/**
 * Parse SendGrid Event Webhook payload.
 * SendGrid sends an array of event objects.
 * @param {object[]} events - Array of SendGrid event objects
 * @returns {object[]} Parsed data for MessageLog updates
 */
function handleWebhook(events) {
  if (!Array.isArray(events)) {
    throw new ValidationError('Invalid SendGrid webhook payload — expected array');
  }

  const parsed = events.map((event) => {
    const mapped = {
      providerMessageId: event.sg_message_id || null,
      status: SENDGRID_EVENT_MAP[event.event] || event.event,
      email: event.email || null,
      eventType: event.event || null,
      timestamp: event.timestamp ? new Date(event.timestamp * 1000) : null,
      reason: event.reason || null,
      rawPayload: event,
    };

    logger.info('SendGrid webhook event', {
      sgMessageId: event.sg_message_id,
      event: event.event,
      mapped: mapped.status,
    });

    return mapped;
  });

  return parsed;
}

module.exports = { sendEmail, sendBatchEmail, handleWebhook, SENDGRID_EVENT_MAP };
