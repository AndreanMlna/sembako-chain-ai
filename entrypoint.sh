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
  echo "▶  Seeding database..."
  node_modules/.bin/prisma db seed
fi

# ---- Start the Next.js server ------------------------------------------
echo ""
echo "▶  Starting Next.js on port ${PORT:-3000}..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
