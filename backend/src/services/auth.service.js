/**
 * @file auth.service.js
 * @description Authentication business logic — login, refresh, logout, getMe.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { env } = require('../config/env');
const { UnauthorizedError, ValidationError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

/* ───── Token helpers ───── */

function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRE });
}

/* ───── Service methods ───── */

/**
 * Login user by email + password + tenantSlug.
 */
async function login(email, password, tenantSlug) {
  if (!email || !password || !tenantSlug) {
    throw new ValidationError('Email, password and tenantSlug are required');
  }

  // 1. Find tenant by slug
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });
  if (!tenant) {
    throw new NotFoundError('Tenant');
  }

  // 2. Find user by composite unique (tenantId + email)
  const user = await prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: email.toLowerCase().trim(),
      },
    },
  });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. Verify password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 4. Generate tokens
  const tokenPayload = {
    userId: user.id,
    tenantId: tenant.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ userId: user.id, tenantId: tenant.id });

  // 5. Persist refresh token in DB (upsert in case of duplicate token within same second)
  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.upsert({
    where: { token: refreshToken },
    update: { expiresAt: new Date(decoded.exp * 1000) },
    create: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  logger.info('User logged in', { userId: user.id, tenantId: tenant.id });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId,
    },
    tenant: {
      id: tenant.id,
      slug: tenant.slug,
      companyName: tenant.companyName,
    },
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

    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    });

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
      role: true,
      tenantId: true,
      createdAt: true,
      tenant: {
        select: { id: true, companyName: true, slug: true },
      },
    },
  });
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
}

module.exports = { login, refresh, logout, getMe };
