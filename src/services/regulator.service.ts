import { apiGet, apiPost } from "@/lib/api";
import type {
  DataInflasi,
  HeatmapData,
  DataLapanganKerja,
  ApiResponse,
} from "@/types";
import type { IntervensiInput } from "@/lib/validators";

const BASE = "/regulator";

// ---- Dashboard Inflasi ----
export async function getDataInflasi(params?: {
  komoditas?: string;
  wilayah?: string;
  periode?: string;
}): Promise<ApiResponse<DataInflasi[]>> {
  return apiGet<DataInflasi[]>(`${BASE}/inflasi`);
}

export async function getPrediksiHarga(
  komoditas: string
): Promise<ApiResponse<{ prediksi: { tanggal: string; harga: number }[] }>> {
  return apiGet(`${BASE}/inflasi/prediksi/${komoditas}`);
}

// ---- Heatmap Stok ----
export async function getHeatmapData(): Promise<ApiResponse<HeatmapData[]>> {
  return apiGet<HeatmapData[]>(`${BASE}/heatmap`);
}

// ---- Intervensi Pasar ----
export async function createIntervensi(
  data: IntervensiInput
): Promise<ApiResponse<{ id: string; status: string }>> {
  return apiPost(`${BASE}/intervensi`, data);
}

export async function getIntervensiList(): Promise<
  ApiResponse<(IntervensiInput & { id: string; status: string; createdAt: string })[]>
> {
  return apiGet(`${BASE}/intervensi`);
}

// ---- Data Lapangan Kerja ----
export async function getDataLapanganKerja(): Promise<
  ApiResponse<DataLapanganKerja[]>
> {
  return apiGet<DataLapanganKerja[]>(`${BASE}/lapangan-kerja`);
}

// ---- Laporan ----
export async function generateLaporan(params: {
  tipe: "INFLASI" | "STOK" | "LAPANGAN_KERJA" | "TRANSAKSI";
  tanggalMulai: string;
  tanggalSelesai: string;
  wilayah?: string;
}): Promise<ApiResponse<{ downloadUrl: string }>> {
  return apiPost(`${BASE}/laporan/generate`, params);
}
