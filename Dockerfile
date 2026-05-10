# ==============================================================================
# Sembako-Chain AI - Production Dockerfile (Pre-built mode)
# ==============================================================================
# We use node:20-alpine because it is small and already cached locally.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install dependencies for healthchecks and Prisma
RUN apk add --no-cache openssl curl libc6-compat gcompat

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs nextjs

# Copy pre-built application and dependencies from the host
# (Ensure you have run `npm run build` on the host before building the image)
COPY .next/          ./.next/
COPY public/         ./public/
COPY node_modules/   ./node_modules/
COPY package.json    ./package.json
COPY prisma/         ./prisma/
COPY prisma.config.ts ./prisma.config.ts
COPY entrypoint.sh   ./

# Fix ownership
RUN chmod +x entrypoint.sh \
 && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["sh", "entrypoint.sh"]
