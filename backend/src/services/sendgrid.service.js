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
  processed: 'SENT',          // SendGrid đã nhận, đang gửi
  delivered: 'DELIVERED',     // Đã vào inbox
  open: 'OPENED',             // Khách đã mở
  click: 'CLICKED',           // Khách đã bấm link
  bounce: 'BOUNCED',          // Sai email, hòm thư đầy...
  dropped: 'FAILED',          // SendGrid từ chối gửi
  deferred: 'PENDING',        // Tạm hoãn, sẽ thử gửi lại
  spamreport: 'SPAM',         // Bị báo cáo spam
  unsubscribe: 'UNSUBSCRIBED',// Hủy nhận thư
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

module.exports = { sendEmail, handleWebhook, SENDGRID_EVENT_MAP };
