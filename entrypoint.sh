#!/bin/sh
set -e

# ============================================================
# Entrypoint for sembako-chain-ai Docker container
# Order: migrate → (optional seed) → start Next.js
# ============================================================

echo "=========================================="
echo "  Sembako-Chain AI — Container Startup"
echo "=========================================="

# ---- Database migrations -----------------------------------------------
echo ""
echo "▶  Running database migrations..."
node_modules/.bin/prisma migrate deploy
echo "✓  Migrations complete."

# ---- Optional seed (only on first run) ---------------------------------
if [ "$SEED_DB" = "true" ]; then
  echo ""
  echo "▶  Checking if database needs seeding..."

  # Count users via a small inline Node.js snippet.
  # Using a heredoc with quoted marker so the shell never expands $disconnect.
  USER_COUNT=$(node - << 'JSEOF'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
prisma.user.count()
  .then(n => { console.log(n); return prisma.$disconnect() })
  .catch(() => { console.log(0); process.exit(0) })
JSEOF
)

  if [ "$USER_COUNT" = "0" ]; then
    echo "   No users found — seeding demo data..."
    npm run db:seed
    echo "✓  Seed complete."
  else
    echo "   Database already contains $USER_COUNT user(s). Skipping seed."
  fi
fi

# ---- Start the Next.js server ------------------------------------------
echo ""
echo "▶  Starting Next.js on port ${PORT:-3000}..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
