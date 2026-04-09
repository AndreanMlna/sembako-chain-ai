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
max_attempts="30"
attempt="1"

while true; do
  if node_modules/.bin/prisma migrate deploy; then
    break
  fi

  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "✗  Database did not become reachable after ${max_attempts} attempts."
    exit 1
  fi

  echo "   Database not ready yet. Retrying in 2 seconds... (${attempt}/${max_attempts})"
  attempt=$((attempt + 1))
  sleep 2
done

echo "✓  Migrations complete."

# ---- Optional seed (only on first run) ---------------------------------
if [ "$SEED_DB" = "true" ]; then
  echo ""
  echo "▶  Checking if database needs seeding..."

  # Count users via a small inline Node.js snippet.
  # Using a heredoc with quoted marker so the shell never expands $disconnect.
  USER_COUNT=$(node - << 'JSEOF' 2>/dev/null || echo "1"
let PrismaClient, PrismaPg, Pool

try {
  ;({ PrismaClient } = require('@prisma/client'))
  ;({ PrismaPg } = require('@prisma/adapter-pg'))
  ;({ Pool } = require('pg'))
} catch {
  console.log(1)
  process.exit(0)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

prisma.user.count()
  .then((n) => {
    console.log(n)
    return prisma.$disconnect().then(() => pool.end())
  })
  .catch((err) => {
    process.stderr.write('seed-check error: ' + err.message + '\n')
    console.log(1)
    process.exit(0)
  })
JSEOF
)

  if [ -z "$USER_COUNT" ]; then
    USER_COUNT="1"
  fi

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
