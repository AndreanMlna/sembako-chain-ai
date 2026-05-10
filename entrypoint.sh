#!/bin/sh
set -e

# ============================================================
# Entrypoint for sembako-chain-ai Docker container
# Order: migrate → (optional seed) → start Next.js
# ============================================================

# Guard against infinite restart loop — skip init on restart
RESTART_GUARD="/app/.container_initialized"

echo "=========================================="
echo "  Sembako-Chain AI — Container Startup"
echo "=========================================="

if [ -f "$RESTART_GUARD" ]; then
  echo ""
  echo "✓  Already initialized — skipping migration & seed."
else
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

    # Use Prisma 7 adapter pattern (PgBoss/Pg adapter required)
    USER_COUNT=$(node -e '
      const { PrismaClient } = require("@prisma/client");
      const { Pool } = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(pool);
      const prisma = new PrismaClient({ adapter });
      prisma.user.count()
        .then(n => { console.log(n); return prisma.$disconnect().then(() => pool.end()); })
        .catch(() => { console.log(0); process.exit(0); });
    ' 2>/dev/null || echo "0")

    if [ "$USER_COUNT" = "0" ]; then
      echo "   No users found — seeding demo data..."
      npx tsx prisma/seed.ts || echo "⚠️  Seed failed, but continuing..."
      echo "✓  Seed complete."
    else
      echo "   Database already contains ${USER_COUNT} user(s). Skipping seed."
    fi
  fi

  touch "$RESTART_GUARD"
fi

# ---- Start the Next.js server ------------------------------------------
echo ""
echo "▶  Starting Next.js on port ${PORT:-3000}..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
