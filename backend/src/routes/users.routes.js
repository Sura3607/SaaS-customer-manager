/**
 * @file users.routes.js
 * @description User management routes.
 * Endpoints: GET /users, POST /users, DELETE /users/:id
 */

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');

const router = Router();

// All user routes require authentication + tenant isolation
router.use(authenticate, tenantIsolation);

// Get all users for the current tenant
router.get('/', usersController.listUsers);

// Create a new user
router.post('/', usersController.createUser);

// Delete a user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
