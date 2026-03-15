/**
 * @file tenants.controller.js
 * @description Tenant management controller — register, get, update, stats.
 */

const tenantService = require('../services/tenant.service');
const { ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * POST /api/v1/tenants/register  (public)
 */
async function register(req, res, next) {
  try {
    const { companyName, adminEmail, adminPassword, adminFullName, phone } = req.body;
    const result = await tenantService.register({
      companyName,
      adminEmail,
      adminPassword,
      adminFullName,
      phone,
    });
    res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/tenants/create  (authenticated — add org to current user)
 */
async function createForUser(req, res, next) {
  try {
    const { companyName, phone } = req.body;
    const userId = req.user.userId;
    const result = await tenantService.createTenantForUser(userId, { companyName, phone });
    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Ensure the requested tenant ID matches the authenticated user's tenant.
 */
function ensureTenantAccess(req) {
  const paramId = req.params.id;
  if (paramId !== req.tenantId) {
    throw new ForbiddenError('Access denied to this tenant');
  }
}

/**
 * GET /api/v1/tenants/:id  (protected + tenant isolation)
 */
async function getById(req, res, next) {
  try {
    ensureTenantAccess(req);
    const tenant = await tenantService.getTenant(req.tenantId);
    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/tenants/:id  (protected + tenant isolation)
 */
async function update(req, res, next) {
  try {
    ensureTenantAccess(req);
    const { companyName, phone } = req.body;
    const tenant = await tenantService.updateTenant(req.tenantId, { companyName, phone });
    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/tenants/:id/stats  (protected + tenant isolation)
 */
async function getStats(req, res, next) {
  try {
    ensureTenantAccess(req);
    const stats = await tenantService.getTenantStats(req.tenantId);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}


/**
 * GET /api/v1/tenants/:id/charts  (protected + tenant isolation)
 */
async function getCharts(req, res, next) {
  try {
    ensureTenantAccess(req);
    const data = await tenantService.getChartData(req.tenantId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, createForUser, getById, update, getStats, getCharts };