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
  // Remove all non-numeric characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // If it already starts with +, return as-is
  if (cleaned.startsWith('+')) return cleaned;
  // Default: assume it needs a + prefix
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
