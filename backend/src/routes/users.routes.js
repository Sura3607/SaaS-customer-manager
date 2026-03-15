/**
 * @file users.routes.js
 */
const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authenticate, tenantIsolation);

router.get('/', usersController.listUsers);
router.post('/', usersController.createUser);
router.delete('/:id', usersController.deleteUser);

// Update current user's profile (fullName, email)
// NOTE: must be defined before /:id to avoid route collision
router.put('/profile', usersController.updateProfile);

module.exports = router;