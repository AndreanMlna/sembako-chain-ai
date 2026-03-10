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
} from "@/types";
import type { LahanInput, TanamanInput, ProdukInput } from "@/lib/validators";

const BASE = "/petani";

// ---- Lahan ----
export async function getLahanList(): Promise<ApiResponse<Lahan[]>> {
  return apiGet<Lahan[]>(`${BASE}/lahan`);
}

export async function getLahanById(id: string): Promise<ApiResponse<Lahan>> {
  return apiGet<Lahan>(`${BASE}/lahan/${id}`);
}

export async function createLahan(data: LahanInput): Promise<ApiResponse<Lahan>> {
  return apiPost<Lahan>(`${BASE}/lahan`, data);
}

export async function updateLahan(id: string, data: LahanInput): Promise<ApiResponse<Lahan>> {
  return apiPut<Lahan>(`${BASE}/lahan/${id}`, data);
}

export async function deleteLahan(id: string): Promise<ApiResponse<void>> {
  return apiDelete<void>(`${BASE}/lahan/${id}`);
}

// ---- Tanaman ----
export async function addTanaman(lahanId: string, data: TanamanInput): Promise<ApiResponse<Tanaman>> {
  return apiPost<Tanaman>(`${BASE}/lahan/${lahanId}/tanaman`, data);
}

export async function updateTanaman(id: string, data: Partial<TanamanInput>): Promise<ApiResponse<Tanaman>> {
  return apiPut<Tanaman>(`${BASE}/tanaman/${id}`, data);
}

// ---- AI Crop Check ----
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

export async function getProdukList(): Promise<PaginatedResponse<Produk>> {
  return apiGetPaginated<Produk>(`${BASE}/produk`);
}

// ---- E-Wallet ----
export async function getWallet(): Promise<ApiResponse<EWallet>> {
  return apiGet<EWallet>(`${BASE}/wallet`);
}

export async function getTransaksiHistory(
  page: number = 1
): Promise<PaginatedResponse<Transaksi>> {
  return apiGetPaginated<Transaksi>(`${BASE}/wallet/transaksi`, page);
}
