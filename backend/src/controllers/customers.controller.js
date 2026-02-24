/**
 * @file customers.controller.js
 * @description Customer CRUD controller.
 */

const customerService = require('../services/customer.service');

/**
 * GET /api/v1/customers
 */
async function getAll(req, res, next) {
  try {
    const result = await customerService.getCustomers(req.tenantId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/customers
 */
async function create(req, res, next) {
  try {
    const customer = await customerService.createCustomer(req.tenantId, req.body);
    res.status(201).json({ success: true, message: 'Customer created', data: customer });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/customers/:id
 */
async function getById(req, res, next) {
  try {
    const customer = await customerService.getCustomerById(req.tenantId, req.params.id);
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/customers/:id
 */
async function update(req, res, next) {
  try {
    const customer = await customerService.updateCustomer(req.tenantId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/customers/:id
 */
async function remove(req, res, next) {
  try {
    await customerService.deleteCustomer(req.tenantId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/customers/bulk
 */
async function bulkCreate(req, res, next) {
  try {
    const result = await customerService.bulkCreateCustomers(req.tenantId, req.body.customers);
    res.status(201).json({ success: true, message: 'Bulk import completed', data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, create, getById, update, remove, bulkCreate };
