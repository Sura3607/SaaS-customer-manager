/**
 * @file auth.routes.js
 * @description Authentication routes.
 * Endpoints: POST /login, POST /logout, POST /refresh, GET /me, PUT /change-password, POST /logout-all-devices
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate, loginSchema, refreshSchema, selectTenantSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/select-tenant', authenticate, validate(selectTenantSchema), authController.selectTenant);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

// Password and session management
router.put('/change-password', authenticate, usersController.changePassword);
router.post('/logout-all-devices', authenticate, usersController.logoutAllDevices);

module.exports = router;
