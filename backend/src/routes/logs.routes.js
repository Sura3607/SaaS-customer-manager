/**
 * @file logs.routes.js
 * @description Message log routes.
 * Mounted at /api/v1/messages — endpoints: GET /logs, GET /logs/:id
 */

const { Router } = require('express');
const messagesController = require('../controllers/messages.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');
const { validate, logQuerySchema } = require('../validators/message.validator');

const router = Router();

router.get('/logs', authenticate, tenantIsolation, validate(logQuerySchema, 'query'), messagesController.getLogs);
router.get('/logs/:id', authenticate, tenantIsolation, messagesController.getLogById);

module.exports = router;

// Delete a message log + its parent Message permanently
router.delete('/logs/:id', authenticate, tenantIsolation, messagesController.deleteMessage);