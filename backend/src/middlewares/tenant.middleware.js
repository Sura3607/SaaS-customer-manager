/**
 * @file tenant.middleware.js
 * @description Multi-tenant isolation middleware.
 * Ensures every request operates within the scope of the authenticated user's tenant.
 * Sets req.tenantId for use in all downstream DB queries.
 */

const { UnauthorizedError } = require('../utils/errors');

/**
 * Extract tenantId from authenticated user and set on request.
 * Must be used AFTER auth.middleware.
 */
function tenantIsolation(req, res, next) {
  if (!req.user || !req.user.tenantId) {
    return next(new UnauthorizedError('Tenant context is required'));
  }

  // Set tenantId on request for easy access in controllers/services
  req.tenantId = req.user.tenantId;
  next();
}

module.exports = { tenantIsolation };
