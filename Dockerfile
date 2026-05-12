# ==============================================================================
# Sembako-Chain AI — Dockerfile
# ==============================================================================
# Bekerja di local maupun server (fresh clone).
# network: host di docker-compose.yml memungkinkan akses npm registry.
# ==============================================================================

# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL (dibutuhkan Prisma 7 engine)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files dulu → Docker cache: npm ci hanya re-run jika package berubah
COPY package.json package-lock.json ./
RUN npm ci

# Build-time env vars — HARUS sebelum prisma generate
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

# Copy seluruh source code & generate Prisma client
COPY . .
RUN npx prisma generate
ARG NEXT_PUBLIC_API_URL=http://localhost:3300/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js
RUN npm run build

# Stage 2: Production runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

# Copy hasil build
COPY --from=builder /app/public           ./public
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.ts   ./

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3300
ENV PORT=3300

ENTRYPOINT ["sh", "entrypoint.sh"]
