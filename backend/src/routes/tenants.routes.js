/**
 * @file tenants.routes.js
 * @description Tenant management routes.
 * Endpoints: POST /register, GET /:id, PUT /:id, GET /:id/stats
 */

const { Router } = require('express');
const tenantsController = require('../controllers/tenants.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');
const { validate, registerTenantSchema, updateTenantSchema } = require('../validators/auth.validator');

const router = Router();

// Public
router.post('/register', validate(registerTenantSchema), tenantsController.register);

// Protected + tenant isolation
router.get('/:id', authenticate, tenantIsolation, tenantsController.getById);
router.put('/:id', authenticate, tenantIsolation, validate(updateTenantSchema), tenantsController.update);
router.get('/:id/stats', authenticate, tenantIsolation, tenantsController.getStats);

module.exports = router;
