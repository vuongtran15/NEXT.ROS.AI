# Use Node.js LTS version as the base image for building
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Set environment variables for Tailwind CSS
ENV TAILWIND_MODE=build
ENV NODE_OPTIONS=--max_old_space_size=4096

# Install system dependencies and npm packages
RUN apt-get update && apt-get install -y \
    libc6 \
    libgcc1 \
    && npm ci \
    && npm install tailwindcss@latest --save-dev

# Copy project files
COPY . .

# Build the application
# RUN npm run build

# Production image
FROM node:20-slim

WORKDIR /app

# Install minimal runtime dependencies for native binaries
RUN apt-get update && apt-get install -y \
    libc6 \
    libgcc1 \
    && rm -rf /var/lib/apt/lists/*


# Copy only necessary files from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start","dev:https"]