/**
 * @file db.js
 * @description Prisma Client Singleton pattern.
 * Prevents multiple PrismaClient instances in development (due to hot-reloading).
 */

const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, reuse the existing PrismaClient to avoid
  // exhausting database connections during hot-reloading.
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
