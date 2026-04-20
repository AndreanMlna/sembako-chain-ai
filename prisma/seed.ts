import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash("password123", 12);

  // ---- Create Users ----
  const petani = await prisma.user.upsert({
    where: { email: "petani@demo.com" },
    update: {},
    create: {
      nama: "Budi Santoso",
      email: "petani@demo.com",
      password: hashedPassword,
      telepon: "081234567890",
      role: "PETANI",
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Lembang",
      kelurahan: "Lembang",
      jalan: "Jl. Raya Lembang No. 10",
      kodePos: "40391",
      latitude: -6.8115,
      longitude: 107.6169,
    },
  });

  const mitraToko = await prisma.user.upsert({
    where: { email: "toko@demo.com" },
    update: {},
    create: {
      nama: "Siti Rahayu",
      email: "toko@demo.com",
      password: hashedPassword,
      telepon: "081234567891",
      role: "MITRA_TOKO",
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Coblong",
      kelurahan: "Dago",
      jalan: "Jl. Ir. H. Juanda No. 50",
      kodePos: "40116",
      latitude: -6.8934,
      longitude: 107.6106,
    },
  });

  const kurir = await prisma.user.upsert({
    where: { email: "kurir@demo.com" },
    update: {},
    create: {
      nama: "Andi Prasetyo",
      email: "kurir@demo.com",
      password: hashedPassword,
      telepon: "081234567892",
      role: "KURIR",
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Cicendo",
      kelurahan: "Pasirkaliki",
      jalan: "Jl. Pasirkaliki No. 25",
      kodePos: "40171",
      latitude: -6.9107,
      longitude: 107.5982,
    },
  });

  const pembeli = await prisma.user.upsert({
    where: { email: "pembeli@demo.com" },
    update: {},
    create: {
      nama: "Dewi Lestari",
      email: "pembeli@demo.com",
      password: hashedPassword,
      telepon: "081234567893",
      role: "PEMBELI",
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Sumur Bandung",
      kelurahan: "Braga",
      jalan: "Jl. Braga No. 100",
      kodePos: "40111",
      latitude: -6.9175,
      longitude: 107.6091,
    },
  });

  const regulator = await prisma.user.upsert({
    where: { email: "regulator@demo.com" },
    update: {},
    create: {
      nama: "Dr. Hadi Wijaya",
      email: "regulator@demo.com",
      password: hashedPassword,
      telepon: "081234567894",
      role: "REGULATOR",
      provinsi: "DKI Jakarta",
      kabupaten: "Jakarta Pusat",
      kecamatan: "Thamrin",
      kelurahan: "Kebon Sirih",
      jalan: "Jl. MH Thamrin No. 2",
      kodePos: "10110",
      latitude: -6.1862,
      longitude: 106.8228,
    },
  });

  // ---- Create E-Wallets ----
  for (const user of [petani, mitraToko, kurir, pembeli, regulator]) {
    await prisma.eWallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        saldo: user.role === "PETANI" ? 2450000 : user.role === "KURIR" ? 1200000 : 500000,
      },
    });
  }

  // ---- Create Lahan for Petani ----
  const lahan1 = await prisma.lahan.create({
    data: {
      petaniId: petani.id,
      nama: "Lahan Lembang Utara",
      luasHektar: 2.5,
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Lembang",
      kelurahan: "Lembang",
      jalan: "Jl. Raya Lembang KM 5",
      kodePos: "40391",
      latitude: -6.8115,
      longitude: 107.6169,
    },
  });

  const lahan2 = await prisma.lahan.create({
    data: {
      petaniId: petani.id,
      nama: "Lahan Ciwidey",
      luasHektar: 1.8,
      provinsi: "Jawa Barat",
      kabupaten: "Bandung",
      kecamatan: "Ciwidey",
      kelurahan: "Ciwidey",
      jalan: "Jl. Raya Ciwidey",
      kodePos: "40973",
      latitude: -7.0472,
      longitude: 107.4911,
    },
  });

  // ---- Create Tanaman ----
  await prisma.tanaman.createMany({
    data: [
      {
        lahanId: lahan1.id,
        nama: "Cabai Merah",
        varietasNama: "Cabai Keriting",
        tanggalTanam: new Date("2026-01-15"),
        estimasiPanen: new Date("2026-04-15"),
        statusPanen: "TUMBUH",
        statusKesehatan: "SEHAT",
        jumlahKg: null,
      },
      {
        lahanId: lahan1.id,
        nama: "Tomat",
        varietasNama: "Tomat Cherry",
        tanggalTanam: new Date("2026-02-01"),
        estimasiPanen: new Date("2026-04-01"),
        statusPanen: "TUMBUH",
        statusKesehatan: "SEHAT",
        jumlahKg: null,
      },
      {
        lahanId: lahan2.id,
        nama: "Bawang Merah",
        varietasNama: "Bawang Brebes",
        tanggalTanam: new Date("2025-12-01"),
        estimasiPanen: new Date("2026-03-01"),
        statusPanen: "SIAP_PANEN",
        statusKesehatan: "SEHAT",
        jumlahKg: 450,
      },
      {
        lahanId: lahan2.id,
        nama: "Kentang",
        varietasNama: "Kentang Granola",
        tanggalTanam: new Date("2025-11-15"),
        estimasiPanen: new Date("2026-02-15"),
        statusPanen: "DIPANEN",
        statusKesehatan: "SEHAT",
        jumlahKg: 800,
      },
    ],
  });

  // ---- Create Mitra Toko ----
  const toko = await prisma.mitraToko.create({
    data: {
      userId: mitraToko.id,
      namaToko: "Toko Segar Dago",
      jenisToko: "Toko Kelontong",
    },
  });

  // ---- Create Kurir Profile ----
  await prisma.kurirProfile.create({
    data: {
      userId: kurir.id,
      jenisKendaraan: "Motor",
      platNomor: "D 1234 ABC",
      isAvailable: true,
      rating: 4.8,
    },
  });

  // ---- Create Produk ----
  const produk1 = await prisma.produk.create({
    data: {
      petaniId: petani.id,
      nama: "Cabai Merah Segar",
      kategori: "Sayuran",
      deskripsi: "Cabai merah keriting segar dari lahan Lembang",
      satuan: "kg",
      hargaPerSatuan: 45000,
      stokTersedia: 50,
      metodeJual: "LANGSUNG",
      latitude: -6.8115,
      longitude: 107.6169,
    },
  });

  const produk2 = await prisma.produk.create({
    data: {
      petaniId: petani.id,
      nama: "Bawang Merah Brebes",
      kategori: "Bumbu",
      deskripsi: "Bawang merah kualitas premium dari Ciwidey",
      satuan: "kg",
      hargaPerSatuan: 35000,
      stokTersedia: 200,
      metodeJual: "DISTRIBUSI",
      latitude: -7.0472,
      longitude: 107.4911,
    },
  });

  const produk3 = await prisma.produk.create({
    data: {
      petaniId: petani.id,
      nama: "Kentang Granola",
      kategori: "Sayuran",
      deskripsi: "Kentang segar ukuran besar dari dataran tinggi",
      satuan: "kg",
      hargaPerSatuan: 18000,
      stokTersedia: 500,
      metodeJual: "DISTRIBUSI",
      latitude: -7.0472,
      longitude: 107.4911,
    },
  });

  // ---- Create Inventory Items for Toko ----
  await prisma.inventoryItem.createMany({
    data: [
      {
        tokoId: toko.id,
        produkId: produk2.id,
        stok: 30,
        minStok: 10,
        hargaJual: 40000,
      },
      {
        tokoId: toko.id,
        produkId: produk3.id,
        stok: 50,
        minStok: 20,
        hargaJual: 22000,
      },
    ],
  });

  // ---- Create Sample Order ----
  const order = await prisma.order.create({
    data: {
      pembeliId: pembeli.id,
      metodeJual: "LANGSUNG",
      status: "DELIVERED",
      totalHarga: 135000,
      ongkosKirim: 10000,
      alamatPengiriman: "Jl. Braga No. 100, Bandung",
      latitude: -6.9175,
      longitude: 107.6091,
      items: {
        create: [
          {
            produkId: produk1.id,
            jumlah: 3,
            harga: 45000,
            subtotal: 135000,
          },
        ],
      },
    },
  });

  // ---- Create Job for Kurir ----
  await prisma.job.create({
    data: {
      kurirId: kurir.id,
      orderId: order.id,
      status: "DELIVERED",
      estimasiJarak: 8.5,
      estimasiWaktu: 25,
      ongkosKirim: 10000,
    },
  });

  // ---- Create Transaksi ----
  await prisma.transaksi.create({
    data: {
      orderId: order.id,
      pengirimId: pembeli.id,
      penerimaId: petani.id,
      jumlah: 145000,
      tipe: "PEMBAYARAN",
      status: "BERHASIL",
      referensi: "TRX-001",
    },
  });

  // ---- Create Notifications ----
  await prisma.notifikasi.createMany({
    data: [
      {
        userId: petani.id,
        judul: "Pesanan Baru",
        pesan: "Anda mendapat pesanan cabai merah 3kg dari Dewi Lestari",
        tipe: "INFO",
        dibaca: true,
        link: "/petani/penjualan",
      },
      {
        userId: petani.id,
        judul: "Tanaman Siap Panen",
        pesan: "Bawang merah di Lahan Ciwidey sudah siap dipanen",
        tipe: "SUKSES",
        dibaca: false,
        link: "/petani/panen",
      },
      {
        userId: kurir.id,
        judul: "Job Selesai",
        pesan: "Pengantaran ke Jl. Braga telah dikonfirmasi pembeli",
        tipe: "SUKSES",
        dibaca: true,
        link: "/kurir/riwayat",
      },
      {
        userId: pembeli.id,
        judul: "Pesanan Diterima",
        pesan: "Pesanan cabai merah 3kg telah sampai",
        tipe: "SUKSES",
        dibaca: false,
        link: "/pembeli/pesanan",
      },
    ],
  });

  console.log("Seeding selesai!");
  console.log("\nAkun demo:");
  console.log("  Petani:    petani@demo.com    / password123");
  console.log("  Toko:      toko@demo.com      / password123");
  console.log("  Kurir:     kurir@demo.com     / password123");
  console.log("  Pembeli:   pembeli@demo.com   / password123");
  console.log("  Regulator: regulator@demo.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
