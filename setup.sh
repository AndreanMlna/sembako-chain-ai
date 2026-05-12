#!/bin/bash
# ============================================================
# Sembako-Chain AI — Setup Script
# ============================================================
# Menyiapkan environment untuk pertama kali.
# Bisa dijalankan di local (development) maupun server (deployment).
# ============================================================
set -e

echo "=========================================="
echo "  Sembako-Chain AI — Setup"
echo "=========================================="

# ---- 1. Cek environment ----
MODE="${1:-local}"
DOMAIN="${DOMAIN:-localhost}"
PORT="${PORT:-3300}"

echo ""
echo "▶ Mode: $MODE"
echo "▶ Domain: $DOMAIN"
echo "▶ Port: $PORT"

# ---- 2. Buat .env jika belum ada ----
if [ ! -f ".env" ]; then
    echo ""
    echo "▶ Membuat .env dari .env.example..."
    cp .env.example .env

    if [ "$MODE" = "server" ]; then
        # Update URLs di .env untuk server
        sed -i "s|http://localhost:3300|https://${DOMAIN}:${PORT}|g" .env
    fi

    echo "✓ .env berhasil dibuat"
else
    echo "✓ .env sudah ada, skip"
fi

# ---- 3. Build & Jalankan ----
echo ""
echo "▶ Membangun & menjalankan Docker..."

if [ "$MODE" = "server" ]; then
    docker compose -f docker-compose.yml -f docker-compose.server.yml up --build -d
else
    docker compose up --build -d
fi

# ---- 4. Cek status ----
echo ""
echo "▶ Menunggu aplikasi siap..."
until curl -sf "http://localhost:${PORT}" > /dev/null 2>&1; do
    sleep 2
done

echo ""
echo "=========================================="
echo "  ✓ Setup selesai!"
echo "  Akses: http://localhost:${PORT}"
if [ "$MODE" = "server" ]; then
echo "  Domain: https://${DOMAIN}:${PORT}"
fi
echo "=========================================="
echo ""
echo "Akun demo:"
echo "  Petani:    petani@demo.com    / password123"
echo "  Toko:      toko@demo.com      / password123"
echo "  Kurir:     kurir@demo.com     / password123"
echo "  Pembeli:   pembeli@demo.com   / password123"
echo "  Regulator: regulator@demo.com / password123"
