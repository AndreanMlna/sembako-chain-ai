# Sembako-Chain AI

Platform rantai pasok komoditas sembako berbasis AI — menghubungkan petani, mitra toko, kurir, pembeli, dan regulator dalam satu ekosistem digital.

---

## 🐳 Menjalankan dengan Docker (Cara Tercepat)

Cara paling mudah untuk menjalankan seluruh proyek tanpa perlu menginstal Node.js atau PostgreSQL secara manual.

### Prasyarat

| Perangkat Lunak | Versi Minimum | Cara Cek |
|---|---|---|
| **Docker** | 24.x | `docker --version` |
| **Docker Compose** | 2.x | `docker compose version` |
| **Node.js** *(hanya untuk langkah 1)* | 18.x | `node -v` |

### Langkah-Langkah

#### 1. Clone & Install dependensi di host

```bash
git clone https://github.com/FarrelGhozy/sembako-chain-ai.git
cd sembako-chain-ai
npm install
```

> **Catatan:** `node_modules` perlu diinstal di host terlebih dahulu karena container Docker **dalam environment ini** tidak memiliki akses keluar ke npm registry. Jika kamu menjalankan Docker di mesin biasa dengan akses internet penuh, kamu bisa melewati langkah ini — pastikan `node_modules/` dihapus dari `.dockerignore` dan tambahkan kembali `RUN npm ci` ke dalam `Dockerfile`.

#### 2. Build & Jalankan semua service

```bash
docker compose up --build
```

Docker Compose akan otomatis:
- Menjalankan PostgreSQL 16
- Menerapkan migrasi database (`prisma migrate deploy`)
- Mengisi data demo (`npm run db:seed`) — hanya jika database masih kosong
- Menjalankan server Next.js di port 3000

Secara default, aplikasi bisa dibuka di **http://localhost:3000** dan PostgreSQL Docker diekspos ke host di **localhost:5433** agar tidak bentrok dengan PostgreSQL lokal yang sering memakai port 5432.

Tunggu hingga muncul pesan: **`✓ Ready in ...ms`**

Buka browser: **http://localhost:3000**

#### 3. Menjalankan ulang (tanpa rebuild)

```bash
docker compose up
```

#### 4. Menghentikan semua service

```bash
# Hentikan tanpa menghapus data
docker compose down

# Hentikan dan hapus semua data (database akan direset)
docker compose down -v
```

### Akun Demo (tersedia setelah startup pertama)

| Role | Email | Password |
|---|---|---|
| **Petani** | `petani@demo.com` | `password123` |
| **Mitra Toko** | `toko@demo.com` | `password123` |
| **Kurir** | `kurir@demo.com` | `password123` |
| **Pembeli** | `pembeli@demo.com` | `password123` |
| **Regulator** | `regulator@demo.com` | `password123` |

### Konfigurasi Docker (opsional)

Variabel environment di `docker-compose.yml` yang bisa disesuaikan:

| Variabel | Default | Keterangan |
|---|---|---|
| `NEXTAUTH_SECRET` | `docker-sembako-secret-...` | **Ganti ini untuk production!** |
| `SEED_DB` | `true` | Set ke `false` setelah data sudah ada |
| `NEXTAUTH_URL` | `http://localhost:3000` | Ganti jika deploy ke server lain |
| `DB_PORT` | `5433` | Port PostgreSQL di host. Ubah ke `5432` jika port itu kosong |

### Troubleshooting Docker

**Port 3000 atau 5432 sudah terpakai:**
```bash
# Ganti port di docker-compose.yml, misalnya:
# ports: - "3001:3000"  # untuk app
# DB_PORT=5434 docker compose up --build  # untuk db
```

**Perlu melihat log secara real-time:**
```bash
docker compose logs -f app   # log aplikasi
docker compose logs -f db    # log database
```

**Reset total (mulai dari awal):**
```bash
docker compose down -v && docker compose up --build
```

---

## Cara Menjalankan di Linux (Tanpa Docker)

### 1. Prasyarat

Pastikan semua perangkat lunak berikut sudah terpasang di sistem Linux kamu:

| Perangkat Lunak | Versi Minimum | Cara Cek |
|---|---|---|
| **Node.js** | 18.x | `node -v` |
| **npm** | 9.x | `npm -v` |
| **PostgreSQL** | 14.x | `psql --version` |
| **Git** | — | `git --version` |

#### Instalasi Node.js (jika belum ada)

```bash
# Menggunakan NodeSource (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Instalasi PostgreSQL (jika belum ada)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Jalankan service PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

### 2. Clone Repository

```bash
git clone https://github.com/FarrelGhozy/sembako-chain-ai.git
cd sembako-chain-ai
```

---

### 3. Install Dependensi

```bash
npm install
```

---

### 4. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Buka file `.env` dan sesuaikan nilainya:

```env
# Koneksi ke database PostgreSQL
# Format: postgresql://<user>:<password>@<host>:<port>/<nama_database>
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/sembako_chain_ai"

# URL aplikasi (jangan diubah saat development lokal)
NEXTAUTH_URL="http://localhost:3000"

# Secret untuk enkripsi sesi NextAuth — ganti dengan string acak yang panjang
NEXTAUTH_SECRET="ganti-dengan-secret-acak-yang-aman"

# URL API (jangan diubah saat development lokal)
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

> **Tips menghasilkan `NEXTAUTH_SECRET`:**
> ```bash
> openssl rand -base64 32
> ```

---

### 5. Siapkan Database PostgreSQL

#### 5a. Buat user dan database

Masuk ke shell PostgreSQL sebagai superuser:

```bash
sudo -u postgres psql
```

Jalankan perintah SQL berikut (gunakan username dan password yang kamu pilih sendiri, lalu sesuaikan juga nilai `DATABASE_URL` di file `.env`):

```sql
CREATE USER <username> WITH PASSWORD '<password>';
CREATE DATABASE sembako_chain_ai OWNER <username>;
GRANT ALL PRIVILEGES ON DATABASE sembako_chain_ai TO <username>;
\q
```

> **Catatan keamanan:** Gunakan username dan password yang unik dan kuat, terutama untuk lingkungan production.

#### 5b. Jalankan migrasi database

```bash
npm run db:migrate
```

Perintah ini akan membuat semua tabel yang diperlukan sesuai dengan skema Prisma.

#### 5c. Isi data awal (seed)

```bash
npm run db:seed
```

Perintah ini akan membuat akun demo dan data contoh di dalam database.

---

### 6. Jalankan Aplikasi

#### Mode Development (dengan hot-reload)

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

#### Mode Production

```bash
npm run build
npm run start
```

---

### 7. Akun Demo

Setelah menjalankan seed, kamu bisa login menggunakan akun berikut:

| Role | Email | Password |
|---|---|---|
| **Petani** | `petani@demo.com` | `password123` |
| **Mitra Toko** | `toko@demo.com` | `password123` |
| **Kurir** | `kurir@demo.com` | `password123` |
| **Pembeli** | `pembeli@demo.com` | `password123` |
| **Regulator** | `regulator@demo.com` | `password123` |

> **⚠️ Peringatan:** Akun demo hanya untuk keperluan development/testing lokal. Jangan deploy akun-akun ini ke lingkungan production karena passwordnya lemah dan mudah ditebak.

---

### 8. Perintah yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Jalankan server development |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Jalankan server production |
| `npm run lint` | Periksa kode dengan ESLint |
| `npm run db:migrate` | Jalankan migrasi database |
| `npm run db:seed` | Isi database dengan data awal |
| `npm run db:reset` | Reset database (hapus semua data & migrasi ulang) |
| `npm run db:studio` | Buka Prisma Studio (GUI database) di browser |

---

### Troubleshooting

**Error: `ECONNREFUSED` saat koneksi ke database**
- Pastikan service PostgreSQL sedang berjalan: `sudo systemctl status postgresql`
- Pastikan nilai `DATABASE_URL` di `.env` sudah benar (user, password, host, port, nama database)

**Error: `relation "users" does not exist`**
- Migrasi database belum dijalankan. Jalankan: `npm run db:migrate`

**Error: `P1001: Can't reach database server`**
- Periksa apakah PostgreSQL menerima koneksi pada port 5432: `ss -tlnp | grep 5432`

**Port 3000 sudah dipakai**
- Gunakan port lain: `PORT=3001 npm run dev`
