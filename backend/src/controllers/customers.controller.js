/**
 * @file customers.controller.js
 * @description Customer CRUD controller.
 */

const customerService = require('../services/customer.service');
const messageService = require('../services/message.service');
const logger = require('../utils/logger');

function escapeHtml(input = '') {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCustomerWelcomeEmail(customer) {
  const safeName = escapeHtml(customer.fullName || 'Valued Customer');

  return {
    subject: 'Confirmation of Customer Profile Creation',
    content: `
      <div style="margin: 0; padding: 24px; background-color: #f5f7fa; font-family: 'Georgia', 'Times New Roman', serif; color: #1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #d1d5db; border-collapse: collapse;">
          <tr>
            <td style="padding: 24px 28px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 22px; line-height: 1.4; color: #111827;">SAAS GROUP 2 Department</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px; font-size: 16px; line-height: 1.8;">
              <p style="margin: 0 0 14px 0;">Dear ${safeName},</p>
              <p style="margin: 0 0 14px 0;">We are pleased to inform you that your customer contact profile has been successfully created in our system.</p>
              <p style="margin: 0 0 14px 0;">If you did not request this registration or believe this message was sent in error, please contact our support team at your earliest convenience.</p>
              <p style="margin: 0;">Yours sincerely,<br />SAAS GROUP 2 Department</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 13px; line-height: 1.6; color: #6b7280;">
              This is an automated service email. Please do not reply directly to this message.
            </td>
          </tr>
        </table>
      </div>
    `.trim(),
  };
}

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

    const { subject, content } = buildCustomerWelcomeEmail(customer);

    try {
      const emailResult = await messageService.sendEmail(req.tenantId, customer.id, subject, content);
      logger.info('Customer welcome email processed', {
        tenantId: req.tenantId,
        customerId: customer.id,
        status: emailResult.status,
      });
    } catch (emailError) {
      // Do not fail customer creation if email provider fails.
      logger.error('Customer created but welcome email failed', {
        tenantId: req.tenantId,
        customerId: customer.id,
        error: emailError.message,
      });
    }

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
