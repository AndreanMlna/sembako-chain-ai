# ==============================================================================
# Stage 1: Build the Next.js application
# ==============================================================================
# node:20-slim (Debian bookworm) is used so the pre-installed node_modules
# (which contain debian-openssl-3.0.x Prisma binaries) are ABI-compatible.
FROM node:20-slim AS builder
WORKDIR /app

# Copy pre-installed node_modules and all source files.
# node_modules are installed on the host before the image is built
# (see README – Docker section) to work around restricted outbound network
# access inside the build container.
COPY . .

# Re-generate the Prisma client for this exact environment.
# prisma generate is pure-JS and does not need a live database.
RUN node_modules/.bin/prisma generate

# Build-time public env var (baked into the JS bundle at build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Dummy DATABASE_URL prevents any build-time env-check from failing;
# the real value is injected at runtime via docker-compose.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

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

# Copy the entrypoint script and fix ownership before dropping privileges
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["sh", "entrypoint.sh"]
