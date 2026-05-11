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
- **Node.js** 18+ (`node -v`) — hanya untuk `npm install` di host

### 1. Clone & Install dependensi di host

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
npm install
```

> `node_modules` diinstall di host terlebih dahulu lalu dicopy ke container saat build. Container build **tidak punya akses ke npm registry** sehingga tidak bisa `npm install` dari dalam Docker.

### 2. Build & Jalankan

```bash
docker compose up --build -d
```

Ini akan otomatis:
- Start **PostgreSQL 16** di container `sembako_db` (port **5433**)
- Build & start **Next.js** di container `sembako_app` (port **3000**)
- Jalankan `prisma migrate deploy` (tunggu DB siap, max 30 retry)
- Jalankan `prisma db:seed` (hanya jika DB masih kosong)

### 3. Buka browser

```
http://localhost:3000
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
# Lihat log
docker compose logs -f app

# Restart setelah code change
docker compose up --build -d

# Stop (data tetap ada)
docker compose down

# Stop + hapus semua data
docker compose down -v
```

### Troubleshooting Docker

| Masalah | Solusi |
|---|---|
| Port 3000 sudah dipakai | Ganti port di `docker-compose.yml`: `"3001:3000"` |
| Port 5433 sudah dipakai | `DB_PORT=5434 docker compose up --build -d` |
| Container restart terus-menerus | `docker compose down -v && docker compose up --build -d` |
| Seed gagal | Cek log: `docker logs sembako_app`. Set `SEED_DB=false` jika sudah ada data |

---

## Menjalankan Tanpa Docker (Manual)

### Prasyarat

- **Node.js** 18+  
- **PostgreSQL** 14+ (running di port 5432)

### 1. Clone & Install

```bash
git clone https://github.com/AndreanMlna/sembako-chain-ai.git
cd sembako-chain-ai
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`, sesuaikan `DATABASE_URL` dengan koneksi PostgreSQL lokalmu:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sembako_chain_ai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="isi-dengan-random-string"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
# Buat database (via psql)
psql -U postgres -c "CREATE DATABASE sembako_chain_ai;"

# Jalankan migrasi
npx prisma migrate deploy

# Isi data demo
npx tsx prisma/seed.ts
```

### 4. Jalankan

```bash
# Development (hot reload)
npm run dev

# Production
npm run build && npm run start
```

Buka: **http://localhost:3000**

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
