# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps ./apps
COPY libs ./libs

# Build all services individually
RUN npm run build:gateway && \
    npm run build:product && \
    npm run build:order && \
    npm run build:user && \
    npm run build:promo && \
    npm run build:review

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built applications from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads/products

# Expose ports for all services
EXPOSE 3000 3001 3002 3003 3004 3005

# Default command (can be overridden in docker-compose)
CMD ["node", "dist/apps/api-gateway/main.js"]
