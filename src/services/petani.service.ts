// src/services/petani.service.ts
import { apiGet, apiPost, apiPut, apiDelete, apiUpload, apiGetPaginated } from "@/lib/api";
import type {
  Lahan,
  Tanaman,
  Produk,
  HasilCropCheck,
  EWallet,
  Transaksi,
  ApiResponse,
  PaginatedResponse,
  PrediksiPanen,
  PrediksiHarga,
  Pesanan,
  MetodeJual // Tambahkan import MetodeJual
} from "@/types";

export type { Tanaman };

import type { LahanInput, TanamanInput, ProdukInput } from "@/lib/validators";

const BASE = "/petani";

// ---- Lahan ----
export async function getLahanList(): Promise<ApiResponse<Lahan[]>> {
  return apiGet<Lahan[]>(`${BASE}/lahan`);
}

export async function getLahanById(id: string): Promise<ApiResponse<Lahan>> {
  return apiGet<Lahan>(`${BASE}/lahan/${id}`);
}

export const getLahanDetail = getLahanById;

export async function createLahan(data: LahanInput): Promise<ApiResponse<Lahan>> {
  return apiPost<Lahan>(`${BASE}/lahan`, data);
}

export async function updateLahan(id: string, data: LahanInput): Promise<ApiResponse<Lahan>> {
  return apiPut<Lahan>(`${BASE}/lahan/${id}`, data);
}

export async function deleteLahan(id: string): Promise<ApiResponse<void>> {
  return apiDelete<void>(`${BASE}/lahan/${id}`);
}

// ---- Tanaman & Prediksi Panen (AI LSTM) ----
export async function addTanaman(lahanId: string, data: TanamanInput): Promise<ApiResponse<Tanaman>> {
  return apiPost<Tanaman>(`${BASE}/lahan/${lahanId}/tanaman`, data);
}

export async function updateTanaman(id: string, data: Partial<TanamanInput>): Promise<ApiResponse<Tanaman>> {
  return apiPut<Tanaman>(`${BASE}/tanaman/${id}`, data);
}

export async function getTanamanList(): Promise<ApiResponse<Tanaman[]>> {
  return apiGet<Tanaman[]>(`${BASE}/tanaman`);
}

export async function getTanamanById(id: string): Promise<ApiResponse<Tanaman>> {
  return apiGet<Tanaman>(`${BASE}/tanaman/${id}`);
}

export async function getPrediksiPanen(lahanId: string): Promise<ApiResponse<PrediksiPanen>> {
  return apiGet<PrediksiPanen>(`${BASE}/lahan/${lahanId}/prediksi-panen`);
}

// ---- AI Crop Check (CNN) ----
export async function submitCropCheck(file: File): Promise<ApiResponse<HasilCropCheck>> {
  return apiUpload<HasilCropCheck>(`${BASE}/crop-check`, file);
}

export async function getCropCheckHistory(): Promise<ApiResponse<HasilCropCheck[]>> {
  return apiGet<HasilCropCheck[]>(`${BASE}/crop-check/history`);
}

// ---- Produk / Penjualan ----
export async function createProduk(data: ProdukInput): Promise<ApiResponse<Produk>> {
  return apiPost<Produk>(`${BASE}/produk`, data);
}

export async function getProdukList(page: number = 1): Promise<PaginatedResponse<Produk>> {
  return apiGetPaginated<Produk>(`${BASE}/produk`, page);
}

// Fitur Baru: Mendapatkan ringkasan stok (Tersedia vs Terkunci) untuk Dashboard Petani
export async function getInventorySummary(): Promise<ApiResponse<Produk[]>> {
  return apiGet<Produk[]>(`${BASE}/produk/inventory-summary`);
}

export async function updateProduk(id: string, data: Partial<ProdukInput>): Promise<ApiResponse<Produk>> {
  return apiPut<Produk>(`${BASE}/produk/${id}`, data);
}

// Fitur Baru: Mengubah strategi/metode jual (FLEKSIBEL, DISTRIBUSI, LANGSUNG)
export async function updateStrategiJual(id: string, metode: MetodeJual): Promise<ApiResponse<Produk>> {
  return apiPut<Produk>(`${BASE}/produk/${id}/strategi`, { metodeJual: metode });
}

export async function deleteProduk(id: string): Promise<ApiResponse<void>> {
  return apiDelete<void>(`${BASE}/produk/${id}`);
}

export async function getPrediksiHarga(komoditas: string): Promise<ApiResponse<PrediksiHarga[]>> {
  return apiGet<PrediksiHarga[]>(`${BASE}/prediksi-harga?komoditas=${komoditas}`);
}

// ---- Manajemen Pesanan (Order B2B/B2C) ----
export async function getPesananMasuk(page: number = 1): Promise<PaginatedResponse<Pesanan>> {
  return apiGetPaginated<Pesanan>(`${BASE}/pesanan`, page);
}

export async function updateStatusPesanan(id: string, status: string): Promise<ApiResponse<Pesanan>> {
  return apiPut<Pesanan>(`${BASE}/pesanan/${id}/status`, { status });
}

// ---- E-Wallet & Transaksi ----
export async function getWallet(): Promise<ApiResponse<EWallet>> {
  return apiGet<EWallet>(`${BASE}/wallet`);
}

export async function getTransaksiHistory(page: number = 1): Promise<PaginatedResponse<Transaksi>> {
  return apiGetPaginated<Transaksi>(`${BASE}/wallet/transaksi`, page);
}

// ---- Dashboard ----
export interface DashboardData {
  stats: {
    totalLahan: number;
    totalTanamanAktif: number;
    totalSiapPanen: number;
    saldoWallet: number;
    stokTerjualBulanIni: number;
    totalStokTerkunci: number;
  };
  upcomingHarvests: Array<{
    id: string;
    nama: string;
    estimasiPanen: Date;
    lahan: string;
    lokasi: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: Date;
  }>;
}

export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  return apiGet<DashboardData>(`${BASE}/dashboard`);
}

export async function updateTanamanStatusOtomatis(): Promise<ApiResponse<void>> {
  return apiPost<void>(`${BASE}/tanaman/update-status`, {});
}