/**
 * @file auth.controller.js
 * @description Authentication controller — login, logout, refresh, me.
 */

const authService = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * POST /api/v1/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/select-tenant
 */
async function selectTenant(req, res, next) {
  try {
    const { tenantId } = req.body;
    const result = await authService.selectTenant(req.user.userId, tenantId);
    res.status(200).json({
      success: true,
      message: 'Tenant selected',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/logout  (protected)
 */
async function logout(req, res, next) {
  try {
    const result = await authService.logout(req.user.userId);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/me  (protected)
 */
async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, selectTenant, refresh, logout, me };
