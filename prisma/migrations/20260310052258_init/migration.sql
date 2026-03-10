-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PETANI', 'MITRA_TOKO', 'KURIR', 'PEMBELI', 'REGULATOR');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MetodeJual" AS ENUM ('DISTRIBUSI', 'LANGSUNG');

-- CreateEnum
CREATE TYPE "StatusPanen" AS ENUM ('TANAM', 'TUMBUH', 'SIAP_PANEN', 'DIPANEN');

-- CreateEnum
CREATE TYPE "StatusKesehatan" AS ENUM ('SEHAT', 'PERINGATAN', 'SAKIT');

-- CreateEnum
CREATE TYPE "TipeTransaksi" AS ENUM ('PEMBAYARAN', 'PENARIKAN', 'TOP_UP', 'REFUND');

-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('PENDING', 'BERHASIL', 'GAGAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jalan" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupaten" TEXT,
    "provinsi" TEXT,
    "kodePos" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "e_wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lahan" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "luasHektar" DOUBLE PRECISION NOT NULL,
    "jalan" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupaten" TEXT,
    "provinsi" TEXT,
    "kodePos" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tanaman" (
    "id" TEXT NOT NULL,
    "lahanId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "varietasNama" TEXT NOT NULL,
    "tanggalTanam" TIMESTAMP(3) NOT NULL,
    "estimasiPanen" TIMESTAMP(3) NOT NULL,
    "statusPanen" "StatusPanen" NOT NULL DEFAULT 'TANAM',
    "statusKesehatan" "StatusKesehatan" NOT NULL DEFAULT 'SEHAT',
    "jumlahKg" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tanaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hasil_crop_checks" (
    "id" TEXT NOT NULL,
    "tanamanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "hasilDiagnosa" TEXT NOT NULL,
    "tingkatKeparahan" INTEGER NOT NULL,
    "solusi" TEXT[],
    "statusKesehatan" "StatusKesehatan" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hasil_crop_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitra_toko" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaToko" TEXT NOT NULL,
    "jenisToko" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mitra_toko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "produkId" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,
    "minStok" INTEGER NOT NULL DEFAULT 10,
    "hargaJual" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kurir_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jenisKendaraan" TEXT NOT NULL,
    "platNomor" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kurir_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "petaniId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "satuan" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "hargaPerSatuan" DOUBLE PRECISION NOT NULL,
    "stokTersedia" DOUBLE PRECISION NOT NULL,
    "metodeJual" "MetodeJual" NOT NULL DEFAULT 'LANGSUNG',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "pembeliId" TEXT NOT NULL,
    "metodeJual" "MetodeJual" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "ongkosKirim" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qrCode" TEXT,
    "alamatPengiriman" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "produkId" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "kurirId" TEXT,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "estimasiJarak" DOUBLE PRECISION,
    "estimasiWaktu" DOUBLE PRECISION,
    "ongkosKirim" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "pengirimId" TEXT NOT NULL,
    "penerimaId" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "tipe" "TipeTransaksi" NOT NULL,
    "status" "StatusTransaksi" NOT NULL DEFAULT 'PENDING',
    "referensi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'INFO',
    "dibaca" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "e_wallets_userId_key" ON "e_wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mitra_toko_userId_key" ON "mitra_toko"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "kurir_profiles_userId_key" ON "kurir_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_orderId_key" ON "jobs"("orderId");

-- AddForeignKey
ALTER TABLE "e_wallets" ADD CONSTRAINT "e_wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lahan" ADD CONSTRAINT "lahan_petaniId_fkey" FOREIGN KEY ("petaniId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tanaman" ADD CONSTRAINT "tanaman_lahanId_fkey" FOREIGN KEY ("lahanId") REFERENCES "lahan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasil_crop_checks" ADD CONSTRAINT "hasil_crop_checks_tanamanId_fkey" FOREIGN KEY ("tanamanId") REFERENCES "tanaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasil_crop_checks" ADD CONSTRAINT "hasil_crop_checks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitra_toko" ADD CONSTRAINT "mitra_toko_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "mitra_toko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kurir_profiles" ADD CONSTRAINT "kurir_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_petaniId_fkey" FOREIGN KEY ("petaniId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_pembeliId_fkey" FOREIGN KEY ("pembeliId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_kurirId_fkey" FOREIGN KEY ("kurirId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_pengirimId_fkey" FOREIGN KEY ("pengirimId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_penerimaId_fkey" FOREIGN KEY ("penerimaId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
