# Sembako-Chain AI

Platform rantai pasok komoditas sembako berbasis AI — menghubungkan **Petani**, **Mitra Toko**, **Kurir**, **Pembeli**, dan **Regulator** dalam satu ekosistem digital.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes, Prisma 7, PostgreSQL 16 |
| Auth | NextAuth.js v4 (Credentials + JWT), bcrypt |
| State | Zustand (cart, auth, notifications) |
| Validasi | Zod + react-hook-form |
| Charts | Recharts |
| AI Service | Python FastAPI (eksternal) — CNN, LSTM, RL |

---

## Role & Dashboard

| Role | Dashboard | Fitur Utama |
|---|---|---|
| **PETANI** | `/petani` | Kelola lahan, tanaman, panen, produk, crop-check AI, e-wallet |
| **MITRA_TOKO** | `/mitra-toko` | Inventory, restock alerts, POS kasir |
| **KURIR** | `/kurir` | Job marketplace, route optimizer, scan QR delivery |
| **PEMBELI** | `/pembeli` | Katalog produk, keranjang, pre-order, tracking |
| **REGULATOR** | `/regulator` | Monitoring inflasi, heatmap stok, intervensi pasar, laporan |

---

## Menjalankan di Local (Development)

### Prasyarat
- **Docker** 24+ & **Docker Compose** 2+

### Cepat — Docker

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
docker compose up --build -d
```

Buka **http://localhost:3300**

### Hot Reload — Manual

```bash
npm install
cp .env.example .env
# Edit .env — sesuaikan DATABASE_URL ke PostgreSQL lokal
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

---

## Deploy ke Server

### 1. Clone di server

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
```

### 2. Buat `.env` untuk server

```bash
cp .env.example .env
```

Edit `.env` — isi dengan domain server:

```env
APP_URL=https://kedai-pangan.my.id
APP_PORT=3300
NEXTAUTH_URL=https://kedai-pangan.my.id
NEXTAUTH_SECRET=(generate dengan openssl rand -base64 32)
NEXT_PUBLIC_API_URL=https://kedai-pangan.my.id/api
DATABASE_URL=postgresql://sembako:sembako_pass@localhost:5432/sembako_chain_ai
DB_PORT=5433
SEED_DB=true
```

### 3. Jalankan

```bash
docker compose -f docker-compose.yml -f docker-compose.server.yml up --build -d
```

Atau pakai script:

```bash
chmod +x setup.sh
APP_URL=https://kedai-pangan.my.id ./setup.sh server
```

Akses: **https://kedai-pangan.my.id:3300**

---

## Konfigurasi `.env`

Semua konfigurasi dipusatkan di file `.env`. Salin dari `.env.example`:

| Variable | Default (Local) | Server | Keterangan |
|---|---|---|---|
| `APP_URL` | `http://localhost:3300` | `https://domain.com` | URL utama aplikasi |
| `APP_PORT` | `3300` | `3300` | Port aplikasi |
| `DATABASE_URL` | `postgresql://...:5432/...` | (sama) | Koneksi PostgreSQL |
| `DB_PORT` | `5433` | `5433` | Port DB di host |
| `NEXTAUTH_URL` | `http://localhost:3300` | `https://domain.com` | URL untuk NextAuth |
| `NEXTAUTH_SECRET` | (wajib diganti) | (wajib diganti) | Secret enkripsi session |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3300/api` | `https://domain.com/api` | API base URL |
| `SEED_DB` | `true` | `true` | Auto-seed database |

---

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Petani | `petani@demo.com` | `password123` |
| Mitra Toko | `toko@demo.com` | `password123` |
| Kurir | `kurir@demo.com` | `password123` |
| Pembeli | `pembeli@demo.com` | `password123` |
| Regulator | `regulator@demo.com` | `password123` |

---

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, register, forgot-password
│   ├── (dashboard)/        # Dashboard per role (petani, mitra-toko, etc)
│   └── api/                # API routes
├── components/             # UI components (ui/, layout/, cards/, charts/)
├── lib/                    # auth.ts, prisma.ts, validators.ts, utils.ts
├── services/               # Service layer per role + AI service
├── store/                  # Zustand stores (auth, cart, notifications)
├── hooks/                  # Custom hooks
├── constants/              # Role labels, nav items
└── types/                  # TypeScript types
prisma/
├── schema.prisma           # Database schema (14 tabel)
├── seed.ts                 # Data seeder
└── migrations/             # Migration files
```

---

## Perintah Berguna

```bash
# Docker
docker compose up --build -d      # Build & jalankan
docker compose logs -f app        # Lihat log real-time
docker compose down               # Stop (data tetap ada)
docker compose down -v            # Stop + hapus semua data

# Manual
npm run dev                       # Development server
npx prisma migrate dev            # Generate & apply migration
npx prisma migrate deploy         # Apply migration (production-safe)
npx prisma migrate reset          # Reset database
npx tsx prisma/seed.ts            # Isi data demo
npx prisma studio                 # GUI database
```

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Port sudah dipakai | Edit `APP_PORT` dan `DB_PORT` di `.env` |
| Container restart terus | `docker compose down -v && docker compose up --build -d` |
| `prisma: not found` | Docker build akan otomatis `npm ci` — pastikan koneksi internet ada |
| Login gagal | Cek `NEXTAUTH_SECRET` sudah di-set di `.env` |
| Database tidak konek | Cek `DATABASE_URL` di `.env` — untuk Docker pakai `@db:5432` |
