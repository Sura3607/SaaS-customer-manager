/**
 * @file auth.middleware.js
 * @description JWT authentication middleware.
 * Extracts and verifies JWT token from Authorization header.
 * Sets req.user = { userId, tenantId, role } on success.
 */

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');

/**
 * Authenticate request via JWT Bearer token.
 * Sets req.user = { userId, tenantId?, role? }.
 * tenantId and role are only present after select-tenant.
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId || null,
      role: decoded.role || null,
    };
    // Convenience: set req.tenantId for tenant-scoped routes
    if (decoded.tenantId) {
      req.tenantId = decoded.tenantId;
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
}

module.exports = { authenticate };
