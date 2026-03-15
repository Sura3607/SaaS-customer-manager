/**
 * @file app.js
 * @description Express application setup with middlewares and routes.
 */

const express = require('express');
const cors = require('cors');
const { generalLimiter } = require('./middlewares/ratelimit.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');
const { recordRequest } = require('./services/health.service');

const { env } = require('./config/env');

// Import routes
const healthRoutes = require('./routes/health.routes');
const tenantRoutes = require('./routes/tenants.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const customerRoutes = require('./routes/customers.routes');
const messageRoutes = require('./routes/messages.routes');
const logRoutes = require('./routes/logs.routes');

// Create Express app
const app = express();

// ============================================
// Global Middlewares
// ============================================

// CORS — restrict to known origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',   // Vite dev server
  'http://localhost:3000',   // Alt dev port
  env.FRONTEND_URL,          // Production (CloudFront, etc.)
].filter(Boolean);

app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? allowedOrigins
    : true, // Allow all in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
// For webhook routes: capture raw body buffer for signature verification (SendGrid ECDSA)
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    // Store raw buffer only for webhook routes that need signature verification
    if (req.originalUrl && req.originalUrl.includes('/webhook')) {
      req.rawBody = buf.toString('utf8');
    }
  },
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Rate limiting (general)
app.use('/api/', generalLimiter);

// Request logging — structured, with response time tracking
app.use((req, res, next) => {
  const start = Date.now();

  // Log on response finish for accurate timing
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Track request metrics for /health/metrics
    recordRequest(res.statusCode);

    const logLevel = res.statusCode >= 500 ? 'error'
      : res.statusCode >= 400 ? 'warn'
      : 'debug';

    logger[logLevel](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userId: req.user?.userId,
      tenantId: req.tenantId,
    });
  });

  next();
});

// ============================================
// API Routes
// ============================================

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/messages', logRoutes);

// ============================================
// 404 Handler — catch unmatched routes
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// ============================================
// Global Error Handler (must be last)
// ============================================
app.use(errorHandler);

module.exports = app;
