# Stage 1: Build Angular app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci

# Copy frontend source and build
COPY angular.json tsconfig*.json ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# Stage 2: Setup server
FROM node:22-alpine AS production

WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source
COPY server/index.js ./

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/devpulse/browser /app/dist/devpulse/browser

WORKDIR /app/server

# Cloud Run sets PORT environment variable
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["node", "index.js"]
