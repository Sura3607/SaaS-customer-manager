/**
 * @file auth.service.js
 * @description Authentication business logic — login, refresh, logout, getMe.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/db');
const { env } = require('../config/env');
const { UnauthorizedError, ValidationError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Token helpers ───── */

function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });
}

function generateRefreshToken(payload) {
  return jwt.sign({ ...payload, jti: crypto.randomUUID() }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRE });
}

/* ───── Service methods ───── */

/**
 * Login user by email + password (no tenantSlug required).
 * Returns user info + list of tenants + tokens.
 */
async function login(email, password) {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // 1. Find user by globally unique email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 2. Verify password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Get all tenants this user belongs to
  const memberships = await prisma.tenantMembership.findMany({
    where: { userId: user.id },
    include: {
      tenant: { select: { id: true, slug: true, companyName: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const tenants = memberships.map((m) => ({
    id: m.tenant.id,
    slug: m.tenant.slug,
    companyName: m.tenant.companyName,
    role: m.role,
  }));

  // 4. Generate tokens (NO tenantId/role in payload — user hasn't selected a tenant yet)
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ userId: user.id });

  // 5. Persist refresh token in DB (create new — supports multi-device login)
  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  logger.info('User logged in', { userId: user.id, tenantCount: tenants.length });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    tenants,
  };
}

/**
 * Select a tenant after login — returns a new "tenant-scoped" access token.
 */
async function selectTenant(userId, tenantId) {
  if (!userId || !tenantId) {
    throw new ValidationError('userId and tenantId are required');
  }

  // Verify user is a member of the requested tenant
  const membership = await prisma.tenantMembership.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
    include: {
      tenant: { select: { id: true, slug: true, companyName: true } },
    },
  });
  if (!membership) {
    throw new UnauthorizedError('You are not a member of this tenant');
  }

  // Generate tenant-scoped access token (contains tenantId + role)
  const tenantToken = generateAccessToken({
    userId,
    tenantId: membership.tenantId,
    role: membership.role,
  });

  logger.info('Tenant selected', { userId, tenantId, role: membership.role });

  return {
    accessToken: tenantToken,
    tenant: {
      id: membership.tenant.id,
      slug: membership.tenant.slug,
      companyName: membership.tenant.companyName,
    },
    role: membership.role,
  };
}

/**
 * Refresh access token using a valid refresh token.
 */
async function refresh(token) {
  if (!token) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Verify token exists in DB (not revoked)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!storedToken) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token expired');
    }

    // Make sure user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Recreate similar access token (preserve tenantId/role if present)
    const payload = { userId: user.id, email: user.email };
    if (decoded.tenantId) {
      payload.tenantId = decoded.tenantId;
    }
    if (decoded.role) {
      payload.role = decoded.role;
    }
    const accessToken = generateAccessToken(payload);

    return { accessToken };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Clean up expired token from DB
      await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => {});
      throw new UnauthorizedError('Refresh token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw err;
  }
}

/**
 * Logout user — revoke refresh token from DB.
 */
async function logout(userId) {
  // Revoke all refresh tokens for this user
  await prisma.refreshToken.deleteMany({ where: { userId } });
  logger.info('User logged out', { userId });
  return { success: true };
}

/**
 * Get current authenticated user profile.
 */
async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      createdAt: true,
      memberships: {
        include: {
          tenant: { select: { id: true, companyName: true, slug: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!user) {
    throw new NotFoundError('User');
  }
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
    tenants: user.memberships.map((m) => ({
      id: m.tenant.id,
      companyName: m.tenant.companyName,
      slug: m.tenant.slug,
      role: m.role,
    })),
  };
}

/**
 * Get all users (members) for a tenant.
 */
async function getUsersByTenant(tenantId) {
  const memberships = await prisma.tenantMembership.findMany({
    where: { tenantId },
    include: {
      user: {
        select: { id: true, email: true, fullName: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return memberships.map((m) => ({
    id: m.user.id,
    email: m.user.email,
    fullName: m.user.fullName,
    role: m.role,
    createdAt: m.user.createdAt,
  }));
}


/**
 * Update user profile (fullName, email).
 * If email changes, ensure it's not already taken by another user.
 */
async function updateUserProfile(userId, { fullName, email }) {
  if (!fullName && !email) {
    throw new ValidationError('At least one field (fullName or email) is required');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');

  const updateData = {};

  if (fullName !== undefined && fullName.trim()) {
    updateData.fullName = fullName.trim();
  }

  if (email !== undefined && email.trim()) {
    const normalised = email.toLowerCase().trim();
    // Check email not taken by another user
    if (normalised !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: normalised } });
      if (existing) throw new ValidationError('Email is already in use by another account');
    }
    updateData.email = normalised;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError('No valid fields to update');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, email: true, fullName: true },
  });

  logger.info('User profile updated', { userId });
  return updated;
}

/**
 * Change password for a user.
 */
async function changePassword(userId, currentPassword, newPassword) {
  if (!userId || !currentPassword || !newPassword) {
    throw new ValidationError('userId, currentPassword and newPassword are required');
  }
  if (newPassword.length < 8) throw new ValidationError('New password must be at least 8 characters');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new UnauthorizedError('Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  logger.info('Password changed', { userId });
  return { success: true };
}

/**
 * Invalidate all refresh tokens for a user (logout all devices).
 */
async function invalidateAllTokens(userId) {
  await prisma.refreshToken.deleteMany({ where: { userId } });
  logger.info('All tokens invalidated', { userId });
  return { success: true };
}

module.exports = { login, selectTenant, refresh, logout, getMe, getUsersByTenant, updateUserProfile, changePassword, invalidateAllTokens };