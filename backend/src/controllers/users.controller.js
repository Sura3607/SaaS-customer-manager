/**
 * @file users.controller.js
 * @description User management controller — list, create, delete, update profile, change password.
 */

const userService = require('../services/auth.service');
const { ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');

async function listUsers(req, res, next) {
  try {
    const users = await userService.getUsersByTenant(req.tenantId);
    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
}

async function createUser(req, res, next) {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await userService.createUser({ email, password, fullName, tenantId: req.tenantId, role: 'STAFF' });
    logger.info(`User created: ${email}`, { tenantId: req.tenantId });
    res.status(201).json({ success: true, message: 'User created successfully', data: { id: user.id, email: user.email, role: user.role } });
  } catch (error) { next(error); }
}

async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user || user.tenantId !== req.tenantId) throw new ForbiddenError('Cannot delete this user');
    const adminCount = await userService.getAdminCountByTenant(req.tenantId);
    if (user.role === 'ADMIN' && adminCount <= 1)
      return res.status(400).json({ success: false, message: 'Cannot delete the last admin user' });
    await userService.deleteUser(userId);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) { next(error); }
}

/**
 * PUT /api/v1/users/profile
 * Update current user's fullName and/or email.
 * Email change takes effect on next login.
 */
async function updateProfile(req, res, next) {
  try {
    const { fullName, email } = req.body;
    // FIX: req.user.userId (not req.userId which is undefined)
    const updated = await userService.updateUserProfile(req.user.userId, { fullName, email });
    logger.info('Profile updated', { userId: req.user.userId });
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) { next(error); }
}

/**
 * PUT /api/v1/auth/change-password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    // FIX: req.user.userId (not req.userId)
    await userService.changePassword(req.user.userId, currentPassword, newPassword);
    logger.info('Password changed', { userId: req.user.userId });
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
}

/**
 * POST /api/v1/auth/logout-all-devices
 */
async function logoutAllDevices(req, res, next) {
  try {
    // FIX: req.user.userId (not req.userId)
    await userService.invalidateAllTokens(req.user.userId);
    logger.info('Logged out from all devices', { userId: req.user.userId });
    res.status(200).json({ success: true, message: 'Logged out from all devices' });
  } catch (error) { next(error); }
}

module.exports = { listUsers, createUser, deleteUser, updateProfile, changePassword, logoutAllDevices };