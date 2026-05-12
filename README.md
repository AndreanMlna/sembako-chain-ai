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
| **KURIR** | `/kurir` | Job marketplace, route optimizer AI, scan QR delivery |
| **PEMBELI** | `/pembeli` | Katalog produk, keranjang, pre-order, tracking |
| **REGULATOR** | `/regulator` | Monitoring inflasi, heatmap stok, intervensi pasar, laporan |

---

## Menjalankan dengan Docker (Cara Termudah)

### Prasyarat

- **Docker** 24+ (`docker --version`)
- **Docker Compose** 2+ (`docker compose version`)

### 1. Clone

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
```

### 2. Jalankan (Development Lokal)

```bash
docker compose up --build -d
```

Atau pakai script setup:

```bash
chmod +x setup.sh && ./setup.sh local
```

Aplikasi akan tersedia di **http://localhost:3300**

### 3. Deploy ke Server (dengan Domain)

```bash
# Set domain & port
export DOMAIN=example.com
export PORT=3300

# Jalankan dengan config server
docker compose -f docker-compose.yml -f docker-compose.server.yml up --build -d
```

Atau pakai script:

```bash
chmod +x setup.sh && DOMAIN=example.com PORT=3300 ./setup.sh server
```

### 4. Akun Demo

| Role | Email | Password |
|---|---|---|
| Petani | `petani@demo.com` | `password123` |
| Mitra Toko | `toko@demo.com` | `password123` |
| Kurir | `kurir@demo.com` | `password123` |
| Pembeli | `pembeli@demo.com` | `password123` |
| Regulator | `regulator@demo.com` | `password123` |

### Perintah Docker Sehari-hari

```bash
docker compose logs -f app        # Lihat log
docker compose up --build -d      # Rebuild setelah code change
docker compose down               # Stop (data tetap ada)
docker compose down -v            # Stop + hapus semua data
```

### Troubleshooting Docker

| Masalah | Solusi |
|---|---|
| Port 3300 sudah dipakai | Ganti port: `PORT=3301 docker compose up --build -d` |
| Port 5433 sudah dipakai | `DB_PORT=5434 docker compose up --build -d` |
| Container restart terus | `docker compose down -v && docker compose up --build -d` |
| Seed gagal | `docker logs sembako_app`. Set `SEED_DB=false` jika sudah ada data |
| `prisma: not found` | Docker build akan otomatis `npm ci` — pastikan koneksi internet ada |

---

## Menjalankan Tanpa Docker (Manual Development)

### Prasyarat

- **Node.js** 18+  
- **PostgreSQL** 14+ (running di port 5432)

### 1. Clone & Install

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
npm install
cp .env.example .env
```

### 2. Setup Database

```bash
psql -U postgres -c "CREATE DATABASE sembako_chain_ai;"
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### 3. Jalankan

```bash
npm run dev
```

Buka: **http://localhost:3300**

### Perintah Berguna

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Build production |
| `npm run start` | Jalankan production server |
| `npx prisma migrate dev` | Generate & apply migration dari schema |
| `npx prisma migrate deploy` | Apply migration (production-safe) |
| `npx prisma migrate reset` | Reset database (hapus semua data) |
| `npx tsx prisma/seed.ts` | Isi data demo |
| `npx prisma studio` | GUI database di browser |
| `npm run lint` | ESLint check |

---

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, register, forgot-password
│   ├── (dashboard)/        # Dashboard per role
│   │   ├── petani/         # 14 halaman (lahan, tanaman, panen, dll)
│   │   ├── mitra-toko/     # 5 halaman (inventory, POS, restock)
│   │   ├── kurir/          # 5 halaman (jobs, route, scan-QR)
│   │   ├── pembeli/        # 6 halaman (katalog, keranjang, tracking)
│   │   ├── regulator/      # 6 halaman (inflasi, heatmap, laporan)
│   │   ├── notifikasi/     # Pusat notifikasi
│   │   └── profil/         # Profil user
│   └── api/                # 23 API route
├── components/             # UI components (ui/, layout/, cards/, charts/, dll)
├── lib/                    # prisma.ts, auth.ts, validators.ts, utils.ts, api.ts
├── services/               # Service layer per role + AI service
├── store/                  # Zustand stores (auth, cart, notifications)
├── hooks/                  # Custom hooks
├── constants/              # Role labels, nav items, komoditas
└── types/                  # TypeScript types & enums
prisma/
├── schema.prisma           # Database schema (14 tabel)
├── seed.ts                 # Data seeder
└── migrations/             # Migration files
```

---

## Database

14 tabel: `users`, `e_wallets`, `lahan`, `tanaman`, `hasil_crop_checks`, `mitra_toko`, `inventory_items`, `kurir_profiles`, `produk`, `orders`, `order_items`, `jobs`, `transaksi`, `notifikasi`

Lihat `prisma/schema.prisma` untuk detail lengkap.

---

## Konfigurasi Environment

| Variable | Default (Docker) | Keterangan |
|---|---|---|
| `DATABASE_URL` | `postgresql://sembako:...@db:5432/...` | Koneksi PostgreSQL |
| `NEXTAUTH_URL` | `http://localhost:3000` | URL aplikasi |
| `NEXTAUTH_SECRET` | — | Secret NextAuth (wajib diganti) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | API base URL |
| `SEED_DB` | `true` | Auto-seed di Docker. Set `false` setelah run pertama |
| `DB_PORT` | `5433` | Port PostgreSQL di host |
