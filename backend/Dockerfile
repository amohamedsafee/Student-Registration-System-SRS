# ==============================================================================
# Production Dockerfile for LLC Student Registration System API Backend
# ==============================================================================

FROM node:20-alpine AS runner

WORKDIR /app

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Copy package descriptors
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Set non-root user for security
USER node

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Use dumb-init to properly forward signals to node process
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
