// ==========================================
// SEMBAKO-CHAIN AI - Constants
// ==========================================

import { UserRole } from "@/types";

// ---- App Config ----
export const APP_NAME = "Sembako-Chain AI";
export const APP_DESCRIPTION =
  "Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi Inflasi dan Inklusi Ekonomi";
export const APP_VERSION = "1.0.0";

// ---- API Config ----
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
export const DEFAULT_PAGE_SIZE = 20;

// ---- Role Labels ----
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.PETANI]: "Petani / Agent",
  [UserRole.MITRA_TOKO]: "Mitra Toko / Pasar",
  [UserRole.KURIR]: "Kurir Lokal",
  [UserRole.PEMBELI]: "Pembeli",
  [UserRole.REGULATOR]: "Regulator (BI/Pemda)",
};

// ---- Role Dashboard Routes ----
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [UserRole.PETANI]: "/petani",
  [UserRole.MITRA_TOKO]: "/mitra-toko",
  [UserRole.KURIR]: "/kurir",
  [UserRole.PEMBELI]: "/pembeli",
  [UserRole.REGULATOR]: "/regulator",
};

// ---- Navigation Items per Role ----
export const NAV_ITEMS = {
  [UserRole.PETANI]: [
    { label: "Dashboard", href: "/petani", icon: "LayoutDashboard" },
    { label: "Data Lahan", href: "/petani/lahan", icon: "MapPin" },
    { label: "Manajemen Panen", href: "/petani/panen", icon: "Wheat" },
    { label: "AI Crop Check", href: "/petani/crop-check", icon: "Camera" },
    { label: "Penjualan", href: "/petani/penjualan", icon: "ShoppingCart" },
    { label: "E-Wallet", href: "/petani/e-wallet", icon: "Wallet" },
    { label: "Riwayat", href: "/petani/riwayat", icon: "History" },
  ],
  [UserRole.MITRA_TOKO]: [
    { label: "Dashboard", href: "/mitra-toko", icon: "LayoutDashboard" },
    { label: "Inventori", href: "/mitra-toko/inventory", icon: "Package" },
    { label: "Restock", href: "/mitra-toko/restock", icon: "RefreshCw" },
    { label: "POS", href: "/mitra-toko/pos", icon: "CreditCard" },
    { label: "Riwayat", href: "/mitra-toko/riwayat", icon: "History" },
  ],
  [UserRole.KURIR]: [
    { label: "Dashboard", href: "/kurir", icon: "LayoutDashboard" },
    { label: "Job Marketplace", href: "/kurir/jobs", icon: "Briefcase" },
    { label: "Route Optimizer", href: "/kurir/route-optimizer", icon: "Route" },
    { label: "Scan QR", href: "/kurir/scan-qr", icon: "QrCode" },
    { label: "Riwayat", href: "/kurir/riwayat", icon: "History" },
  ],
  [UserRole.PEMBELI]: [
    { label: "Dashboard", href: "/pembeli", icon: "LayoutDashboard" },
    { label: "Katalog", href: "/pembeli/katalog", icon: "Search" },
    { label: "Pre-Order", href: "/pembeli/pre-order", icon: "CalendarClock" },
    { label: "Keranjang", href: "/pembeli/keranjang", icon: "ShoppingCart" },
    { label: "Pesanan", href: "/pembeli/pesanan", icon: "Package" },
    { label: "Tracking", href: "/pembeli/tracking", icon: "MapPin" },
  ],
  [UserRole.REGULATOR]: [
    { label: "Dashboard", href: "/regulator", icon: "LayoutDashboard" },
    { label: "Inflasi", href: "/regulator/inflasi", icon: "TrendingUp" },
    { label: "Heatmap Stok", href: "/regulator/heatmap", icon: "Map" },
    {
      label: "Intervensi Pasar",
      href: "/regulator/intervensi",
      icon: "Shield",
    },
    {
      label: "Lapangan Kerja",
      href: "/regulator/lapangan-kerja",
      icon: "Users",
    },
    { label: "Laporan", href: "/regulator/laporan", icon: "FileText" },
  ],
};

// ---- Kategori Komoditas ----
export const KATEGORI_KOMODITAS = [
  "Beras",
  "Jagung",
  "Kedelai",
  "Bawang Merah",
  "Bawang Putih",
  "Cabai Merah",
  "Cabai Rawit",
  "Tomat",
  "Kentang",
  "Wortel",
  "Sayuran Hijau",
  "Buah-buahan",
  "Telur",
  "Daging Ayam",
  "Daging Sapi",
  "Ikan Segar",
  "Gula Pasir",
  "Minyak Goreng",
  "Tepung Terigu",
] as const;

// ---- Satuan Produk ----
export const SATUAN_PRODUK = [
  "kg",
  "gram",
  "ikat",
  "buah",
  "liter",
  "karung",
  "peti",
] as const;

// ---- Status Colors (for UI) ----
export const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

export const KESEHATAN_COLORS = {
  SEHAT: "bg-green-100 text-green-800",
  PERINGATAN: "bg-yellow-100 text-yellow-800",
  SAKIT: "bg-red-100 text-red-800",
} as const;
