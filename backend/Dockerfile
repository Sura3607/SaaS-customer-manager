# ──────────────────────────────────────────────
# Stage 1: Build (generate Prisma Client)
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install production deps + Prisma CLI (devDep) for generate
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# ──────────────────────────────────────────────
# Stage 2: Production image
# ──────────────────────────────────────────────
FROM node:20-alpine

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production deps + Prisma CLI
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma schema (needed at runtime for some Prisma operations)
COPY prisma ./prisma

# Copy application code
COPY src ./src

# Copy healthcheck script
COPY healthcheck.js ./healthcheck.js

# Create logs directory writable by non-root user
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs

# Switch to non-root user
USER appuser

EXPOSE 5000

# Docker health check — uses the lightweight liveness probe
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js

CMD npx prisma db push --accept-data-loss --skip-generate && node src/server.js
