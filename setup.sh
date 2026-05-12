#!/bin/bash
# ============================================================
# Sembako-Chain AI — Setup Script
# ============================================================
# DEVELOPMENT:  ./setup.sh
# SERVER:       ./setup.sh server
# ============================================================
set -e

MODE="${1:-local}"

echo "=========================================="
echo "  Sembako-Chain AI — Setup"
echo "  Mode: ${MODE}"
echo "=========================================="

# ---- .env ----
if [ ! -f ".env" ]; then
    echo ""
    echo "▶ Membuat .env dari .env.example..."
    cp .env.example .env
    echo "✓ .env berhasil dibuat"
    echo "⚠️  Edit .env untuk menyesuaikan konfigurasi (terutama NEXTAUTH_SECRET)"
else
    echo "✓ .env sudah ada"
fi

# Set production URLs if server mode
if [ "$MODE" = "server" ]; then
    if [ -z "$APP_URL" ]; then
        echo ""
        echo "⚠️  APP_URL belum di-set."
        echo "   Contoh: APP_URL=https://domain-anda.com ./setup.sh server"
        echo ""
        read -p "Masukkan APP_URL (contoh: https://kedai-pangan.my.id): " APP_URL
    fi
    # Update .env with server URL
    sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" .env
    sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=${APP_URL}|" .env
    sed -i "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=${APP_URL}/api|" .env
    echo "✓ APP_URL di-set ke ${APP_URL}"
fi

# ---- Build & Run ----
echo ""
echo "▶ Membangun & menjalankan Docker..."

if [ "$MODE" = "server" ]; then
    docker compose -f docker-compose.yml -f docker-compose.server.yml up --build -d
else
    docker compose up --build -d
fi

# ---- Wait for ready ----
APP_PORT="${APP_PORT:-3300}"
echo ""
echo "▶ Menunggu aplikasi siap di port ${APP_PORT}..."
until curl -sf "http://localhost:${APP_PORT}" > /dev/null 2>&1; do
    sleep 2
done

echo ""
echo "=========================================="
echo "  ✓ Aplikasi siap!"
echo "  URL: http://localhost:${APP_PORT}"
echo "=========================================="
echo ""
echo "Akun demo:"
echo "  Petani:    petani@demo.com    / password123"
echo "  Toko:      toko@demo.com      / password123"
echo "  Kurir:     kurir@demo.com     / password123"
echo "  Pembeli:   pembeli@demo.com   / password123"
echo "  Regulator: regulator@demo.com / password123"
