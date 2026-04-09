# ==============================================================================
# Stage 1: Build the Next.js application
# ==============================================================================
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies in image for reproducible builds.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code after dependencies to maximize layer cache reuse.
COPY . .

# Dummy DATABASE_URL prevents Prisma config env validation from failing at build time;
# the real value is injected at runtime via docker-compose.
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

# Re-generate the Prisma client for this exact environment.
# prisma generate is pure-JS and does not need a live database.
RUN npx prisma generate

# Build-time public env var (baked into the JS bundle at build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

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
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Copy the entrypoint script and fix ownership before dropping privileges
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["sh", "entrypoint.sh"]
