/**
 * @file formatters.js
 * @description Utility functions for formatting data.
 */

/**
 * Format phone number to E.164 format.
 * @param {string} phone
 * @returns {string}
 */
function formatPhoneE164(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  // VN local format: 0xxxxxxxxx -> +84xxxxxxxxx
  if (cleaned.startsWith('0')) return `+84${cleaned.slice(1)}`;
  return `+${cleaned}`;
}

/**
 * Sanitize email to lowercase and trim.
 * @param {string} email
 * @returns {string}
 */
function sanitizeEmail(email) {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Generate a URL-friendly slug from a string.
 * @param {string} str
 * @returns {string}
 */
function generateSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format pagination response.
 * @param {Array} data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 * @returns {object}
 */
function paginatedResponse(data, total, page, limit) {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  formatPhoneE164,
  sanitizeEmail,
  generateSlug,
  paginatedResponse,
};
