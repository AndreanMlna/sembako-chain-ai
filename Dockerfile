# ==============================================================================
# Stage 1: Build the Next.js application
# ==============================================================================
# node:20-slim (Debian bookworm) is used so the pre-installed node_modules
# (which contain debian-openssl-3.0.x Prisma binaries) are ABI-compatible.
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL so Prisma 7 engine can detect libssl at build time
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY . .

# Dummy env vars for build-time only.
# Real values are injected at runtime via docker-compose.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
ARG NEXT_PUBLIC_API_URL=http://localhost:3300/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Re-generate the Prisma client for this exact environment.
RUN node_modules/.bin/prisma generate

# Build the Next.js app
RUN npm run build

# ==============================================================================
# Stage 2: Production runner
# ==============================================================================
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL (required for Prisma to detect the correct library at runtime)
# and curl for the Docker health check.
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Create a dedicated non-root user for security
RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

# Copy the built application, dependencies, and schema
COPY --from=builder /app/public           ./public
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.ts   ./

# Copy the entrypoint script and fix ownership before dropping privileges
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3300
ENV PORT=3300

ENTRYPOINT ["sh", "entrypoint.sh"]
