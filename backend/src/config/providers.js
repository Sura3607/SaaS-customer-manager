/**
 * @file providers.js
 * @description External service providers configuration (Twilio & SendGrid).
 * Lazy-initialized to avoid errors when credentials are not yet configured.
 */

const { env } = require('./env');

/**
 * Get configured Twilio client.
 * @returns {import('twilio').Twilio|null}
 */
function getTwilioClient() {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    console.warn('[PROVIDERS] Twilio credentials not configured.');
    return null;
  }
  const twilio = require('twilio');
  return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

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
  getTwilioClient,
  getSendGridClient,
  TWILIO_PHONE_NUMBER: env.TWILIO_PHONE_NUMBER,
  SENDGRID_FROM_EMAIL: env.SENDGRID_FROM_EMAIL,
};
