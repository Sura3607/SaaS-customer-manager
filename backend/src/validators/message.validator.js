/**
 * @file message.validator.js
 * @description Joi validation schemas for Messaging endpoints.
 */

const Joi = require('joi');

/* ───── SMS Schemas ───── */

const sendSMSSchema = Joi.object({
  customerId: Joi.string().required().messages({
    'any.required': 'customerId is required',
  }),
  content: Joi.string().min(1).max(1600).required().messages({
    'string.min': 'SMS content cannot be empty',
    'string.max': 'SMS content cannot exceed 1600 characters',
    'any.required': 'SMS content is required',
  }),
});

const batchSMSSchema = Joi.object({
  customerIds: Joi.array().items(Joi.string()).min(1).max(100).required().messages({
    'array.min': 'At least 1 customerId is required',
    'array.max': 'Maximum 100 customers per batch',
    'any.required': 'customerIds array is required',
  }),
  content: Joi.string().min(1).max(1600).required(),
});

/* ───── Email Schemas ───── */

const sendEmailSchema = Joi.object({
  customerId: Joi.string().required().messages({
    'any.required': 'customerId is required',
  }),
  subject: Joi.string().min(1).max(200).required().messages({
    'string.min': 'Subject cannot be empty',
    'string.max': 'Subject cannot exceed 200 characters',
    'any.required': 'Subject is required',
  }),
  content: Joi.string().min(1).max(50000).required().messages({
    'string.min': 'Email content cannot be empty',
    'string.max': 'Email content cannot exceed 50000 characters',
    'any.required': 'Email content is required',
  }),
});

const batchEmailSchema = Joi.object({
  customerIds: Joi.array().items(Joi.string()).min(1).max(100).required(),
  subject: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).max(50000).required(),
});

/* ───── Log Query Schema ───── */

const logQuerySchema = Joi.object({
  type: Joi.string().valid('SMS', 'EMAIL').optional(),
  status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

/* ───── Middleware ───── */

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) return next(error);
    req[source] = value;
    next();
  };
}

module.exports = {
  sendSMSSchema,
  batchSMSSchema,
  sendEmailSchema,
  batchEmailSchema,
  logQuerySchema,
  validate,
};
