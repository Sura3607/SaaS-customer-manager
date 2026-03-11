/**
 * @file users.controller.js
 * @description User management controller — list, create, delete, change password.
 */

const userService = require('../services/auth.service');
const { ForbiddenError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * GET /api/v1/users  (protected)
 * Get all users for the current tenant
 */
async function listUsers(req, res, next) {
  try {
    const users = await userService.getUsersByTenant(req.tenantId);
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/users  (protected)
 * Create a new user in the current tenant
 */
async function createUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await userService.createUser({
      email,
      password,
      tenantId: req.tenantId,
      role: 'STAFF',
    });

    logger.info(`User created: ${email}`, { tenantId: req.tenantId });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/users/:id  (protected)
 * Delete a user from the current tenant
 */
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;

    // Verify user belongs to the same tenant
    const user = await userService.getUserById(userId);
    if (!user || user.tenantId !== req.tenantId) {
      throw new ForbiddenError('Cannot delete this user');
    }

    // Prevent deleting the last admin
    const adminCount = await userService.getAdminCountByTenant(req.tenantId);
    if (user.role === 'ADMIN' && adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last admin user',
      });
    }

    await userService.deleteUser(userId);

    logger.info(`User deleted: ${user.email}`, { tenantId: req.tenantId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/auth/change-password  (protected)
 * Change the current user's password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    await userService.changePassword(req.userId, currentPassword, newPassword);

    logger.info('Password changed', { userId: req.userId, tenantId: req.tenantId });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/logout-all-devices  (protected)
 * Logout from all devices by invalidating all tokens
 */
async function logoutAllDevices(req, res, next) {
  try {
    await userService.invalidateAllTokens(req.userId);

    logger.info('Logged out from all devices', { userId: req.userId, tenantId: req.tenantId });

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  createUser,
  deleteUser,
  changePassword,
  logoutAllDevices,
};
