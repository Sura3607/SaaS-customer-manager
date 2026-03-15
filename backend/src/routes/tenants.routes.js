/**
 * @file tenants.routes.js
 * @description Tenant management routes.
 * Endpoints: POST /register, GET /:id, PUT /:id, GET /:id/stats
 */

const { Router } = require('express');
const tenantsController = require('../controllers/tenants.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');
const { validate, registerTenantSchema, updateTenantSchema, createTenantForUserSchema } = require('../validators/auth.validator');

const router = Router();

// Public
router.post('/register', validate(registerTenantSchema), tenantsController.register);

// Authenticated — create a new org for the currently logged-in user
router.post('/create', authenticate, validate(createTenantForUserSchema), tenantsController.createForUser);

// Protected + tenant isolation
router.get('/:id', authenticate, tenantIsolation, tenantsController.getById);
router.put('/:id', authenticate, tenantIsolation, validate(updateTenantSchema), tenantsController.update);
router.get('/:id/stats', authenticate, tenantIsolation, tenantsController.getStats);
router.get('/:id/charts', authenticate, tenantIsolation, tenantsController.getCharts);

module.exports = router;