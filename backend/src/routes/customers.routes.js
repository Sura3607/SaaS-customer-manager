/**
 * @file customers.routes.js
 * @description Customer CRUD routes.
 * Endpoints: GET /, POST /, GET /:id, PUT /:id, DELETE /:id, POST /bulk
 */

const { Router } = require('express');
const customersController = require('../controllers/customers.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { tenantIsolation } = require('../middlewares/tenant.middleware');
const {
  validate,
  createCustomerSchema,
  updateCustomerSchema,
  bulkCreateSchema,
  listQuerySchema,
} = require('../validators/customer.validator');

const router = Router();

// All customer routes require auth + tenant isolation
router.use(authenticate, tenantIsolation);

router.get('/', validate(listQuerySchema, 'query'), customersController.getAll);
router.post('/', validate(createCustomerSchema), customersController.create);
router.post('/bulk', validate(bulkCreateSchema), customersController.bulkCreate);
router.get('/:id', customersController.getById);
router.put('/:id', validate(updateCustomerSchema), customersController.update);
router.delete('/:id', customersController.remove);

module.exports = router;
