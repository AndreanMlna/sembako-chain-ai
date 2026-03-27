// ==========================================
// SEMBAKO-CHAIN AI - Type Definitions
// ==========================================

// ---- Enums ----
export enum UserRole {
  PETANI = "PETANI",
  MITRA_TOKO = "MITRA_TOKO",
  KURIR = "KURIR",
  PEMBELI = "PEMBELI",
  REGULATOR = "REGULATOR",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum MetodeJual {
  DISTRIBUSI = "DISTRIBUSI", // B2B - ke Toko/Pasar
  LANGSUNG = "LANGSUNG", // B2C - langsung ke konsumen
  FLEKSIBEL = "FLEKSIBEL", // UPDATE: Alokasi otomatis oleh AI
}

// UPDATE: Menambahkan StatusProduk sesuai Prisma untuk manajemen stok profesional
export enum StatusProduk {
  TERSEDIA = "TERSEDIA",
  TERPESAN = "TERPESAN",
  DIKIRIM = "DIKIRIM",
  HABIS = "HABIS",
}

export enum StatusPanen {
  TANAM = "TANAM",
  TUMBUH = "TUMBUH",
  SIAP_PANEN = "SIAP_PANEN",
  DIPANEN = "DIPANEN",
}

export enum StatusKesehatan {
  SEHAT = "SEHAT",
  PERINGATAN = "PERINGATAN",
  SAKIT = "SAKIT",
}

// ---- Base Types ----
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---- User Types ----
export interface User extends BaseEntity {
  nama: string;
  email: string;
  telepon: string;
  role: UserRole;
  avatar?: string;
  alamat: Alamat;
  isActive: boolean;
}

export interface Alamat {
  jalan: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  latitude: number;
  longitude: number;
}

// ---- Petani Types ----
export interface Petani extends User {
  role: UserRole.PETANI;
  lahan: Lahan[];
  saldoWallet: number;
}

export interface Lahan extends BaseEntity {
  nama: string;
  petaniId: string;
  luasHektar: number;
  lokasi: Alamat;
  tanaman: Tanaman[];
}

export interface Tanaman extends BaseEntity {
  nama: string;
  lahanId: string;
  varietasNama: string;
  tanggalTanam: Date;
  estimasiPanen: Date;
  statusPanen: StatusPanen;
  statusKesehatan: StatusKesehatan;
  jumlahKg?: number;
}

export interface HasilCropCheck extends BaseEntity {
  tanamanId: string;
  fotoUrl: string;
  hasilDiagnosa: string;
  tingkatKeparahan: number; // 0-100
  solusi: string[];
  statusKesehatan: StatusKesehatan;
}

export type Pesanan = Order;

// Tipe untuk output prediksi AI LSTM (Panen)
export interface PrediksiPanen {
  lahanId: string;
  tanamanId: string;
  estimasiTanggal: Date;
  estimasiVolumeKg: number;
  tingkatAkurasi: number; // 0-100
  rekomendasiTindakan: string;
}

// Tipe untuk output prediksi AI LSTM (Harga)
export interface PrediksiHarga {
  komoditas: string;
  tanggal: Date;
  prediksiHargaRp: number;
  trend: "NAIK" | "TURUN" | "STABIL";
  batasBawahRp: number;
  batasAtasRp: number;
}

// ---- Mitra Toko Types ----
export interface MitraToko extends User {
  role: UserRole.MITRA_TOKO;
  namaToko: string;
  jenisToko: string;
  inventori: InventoryItem[];
}

export interface InventoryItem extends BaseEntity {
  tokoId: string;
  produkId: string;
  produk: Produk;
  stok: number;
  minStok: number; // threshold auto-restock alert
  hargaJual: number;
}

// ---- Kurir Types ----
export interface Kurir extends User {
  role: UserRole.KURIR;
  jenisKendaraan: string;
  platNomor: string;
  isAvailable: boolean;
  rating: number;
}

export interface Job extends BaseEntity {
  kurirId?: string;
  orderId: string;
  pickupPoints: PickupPoint[];
  deliveryPoints: DeliveryPoint[];
  status: OrderStatus;
  estimasiJarak: number; // km
  estimasiWaktu: number; // menit
  ongkosKirim: number;
}

export interface PickupPoint {
  alamat: Alamat;
  kontakNama: string;
  kontakTelepon: string;
  items: OrderItem[];
}

export interface DeliveryPoint {
  alamat: Alamat;
  kontakNama: string;
  kontakTelepon: string;
  items: OrderItem[];
}

// ---- Produk & Order Types ----
export interface Produk extends BaseEntity {
  nama: string;
  kategori: string;
  deskripsi: string;
  satuan: string; // kg, ikat, buah
  fotoUrl: string;
  petaniId: string;
  hargaPerSatuan: number;
  stokTersedia: number;
  // UPDATE: Tambahan field untuk sinkronisasi dengan Prisma
  stokTerkunci: number;
  status: StatusProduk;
  metodeJual: MetodeJual;
  lokasiAsal: Alamat;
}

export interface Order extends BaseEntity {
  pembeliId: string;
  metodeJual: MetodeJual;
  items: OrderItem[];
  status: OrderStatus;
  totalHarga: number;
  ongkosKirim: number;
  alamatPengiriman: Alamat;
  kurirId?: string;
  qrCode: string;
}

export interface OrderItem {
  produkId: string;
  produk: Produk;
  jumlah: number;
  harga: number;
  subtotal: number;
}

// ---- Transaksi & E-Wallet Types ----
export interface Transaksi extends BaseEntity {
  orderId: string;
  pengirimId: string;
  penerimaId: string;
  jumlah: number;
  tipe: "PEMBAYARAN" | "PENARIKAN" | "TOP_UP" | "REFUND";
  status: "PENDING" | "BERHASIL" | "GAGAL";
  referensi: string;
}

export interface EWallet extends BaseEntity {
  userId: string;
  saldo: number;
  riwayatTransaksi: Transaksi[];
}

// ---- Regulator/Dashboard Types ----
export interface DataInflasi {
  komoditas: string;
  hargaSekarang: number;
  hargaMingguLalu: number;
  hargaBulanLalu: number;
  prediksiHarga30Hari: number;
  perubahanPersen: number;
  wilayah: string;
  tanggal: Date;
}

export interface HeatmapData {
  wilayah: string;
  latitude: number;
  longitude: number;
  stokLevel: number; // 0-100
  rataRataHarga: number;
  jumlahTransaksi: number;
}

export interface DataLapanganKerja {
  wilayah: string;
  jumlahPetani: number;
  jumlahKurir: number;
  jumlahMitraToko: number;
  jumlahEnumerator: number;
  totalTransaksi: number;
  totalPendapatan: number;
}

// ---- Notifikasi Types ----
export interface Notifikasi extends BaseEntity {
  userId: string;
  judul: string;
  pesan: string;
  tipe: "INFO" | "PERINGATAN" | "SUKSES" | "ERROR";
  dibaca: boolean;
  link?: string;
}

// ---- API Response Types ----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}