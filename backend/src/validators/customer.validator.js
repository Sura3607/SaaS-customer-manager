/**
 * @file customer.validator.js
 * @description Joi validation schemas for Customer endpoints.
 */

const Joi = require('joi');

const createCustomerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters',
    'any.required': 'Full name is required',
  }),
  phone: Joi.string()
    .pattern(/^(\+[1-9]\d{6,14}|0[1-9]\d{8,9})$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be in international format (+...) or Vietnamese local format (0...)',
      'any.required': 'Phone is required',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Email is required',
  }),
  address: Joi.string().max(500).optional().allow('', null),
});

const updateCustomerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^(\+[1-9]\d{6,14}|0[1-9]\d{8,9})$/)
    .optional()
    .messages({ 'string.pattern.base': 'Phone must be in international format (+...) or Vietnamese local format (0...)' }),
  email: Joi.string().email().optional(),
  address: Joi.string().max(500).optional().allow('', null),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});

const bulkCreateSchema = Joi.object({
  customers: Joi.array()
    .items(createCustomerSchema)
    .min(1)
    .max(500)
    .required()
    .messages({
      'array.min': 'At least 1 customer is required',
      'array.max': 'Maximum 500 customers per bulk request',
      'any.required': 'customers array is required',
    }),
});

const listQuerySchema = Joi.object({
  q: Joi.string().max(200).optional().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('fullName', 'createdAt', '-fullName', '-createdAt').default('-createdAt'),
});

/**
 * Express middleware that validates req[source] against a Joi schema.
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(error);
    }
    req[source] = value;
    next();
  };
}

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  bulkCreateSchema,
  listQuerySchema,
  validate,
};
