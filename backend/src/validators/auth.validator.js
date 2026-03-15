/**
 * @file auth.validator.js
 * @description Joi validation schemas for Auth & Tenant endpoints.
 */

const Joi = require('joi');

/* ───── Auth Schemas ───── */

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const selectTenantSchema = Joi.object({
  tenantId: Joi.string().required().messages({
    'any.required': 'Tenant ID is required',
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

/* ───── Tenant Schemas ───── */

const registerTenantSchema = Joi.object({
  companyName: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Company name must be at least 2 characters',
    'any.required': 'Company name is required',
  }),
  adminEmail: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Admin email is required',
  }),
  adminPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Admin password is required',
  }),
  adminFullName: Joi.string().max(255).optional(),
  phone: Joi.string().max(20).optional().allow('', null),
});

const updateTenantSchema = Joi.object({
  companyName: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().max(20).optional().allow('', null),
}).min(1).messages({
  'object.min': 'At least one field must be provided to update',
});

const createTenantForUserSchema = Joi.object({
  companyName: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Company name must be at least 2 characters',
    'any.required': 'Company name is required',
  }),
  phone: Joi.string().max(20).optional().allow('', null),
});

/* ───── Middleware factory ───── */

/**
 * Express middleware that validates req.body against a Joi schema.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(error); // handled by error.middleware.js (isJoi check)
    }
    req.body = value; // replace with sanitised values
    next();
  };
}

module.exports = {
  loginSchema,
  selectTenantSchema,
  refreshSchema,
  registerTenantSchema,
  updateTenantSchema,
  createTenantForUserSchema,
  validate,
};
