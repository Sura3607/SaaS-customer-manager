/**
 * @file providers.js
 * @description External service providers configuration.
 * Lazy-initialized to avoid errors when credentials are not yet configured.
 */

const { env } = require('./env');

/**
 * Get configured SendGrid mail client.
 * @returns {import('@sendgrid/mail').MailService|null}
 */
function getSendGridClient() {
  if (!env.SENDGRID_API_KEY) {
    console.warn('[PROVIDERS] SendGrid API key not configured.');
    return null;
  }
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(env.SENDGRID_API_KEY);
  return sgMail;
}

module.exports = {
  getSendGridClient,
  SENDGRID_FROM_EMAIL: env.SENDGRID_FROM_EMAIL,
};
