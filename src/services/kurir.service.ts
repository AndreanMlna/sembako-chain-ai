import { apiGet, apiPost, apiPut } from "@/lib/api";
import type { Job, ApiResponse, PaginatedResponse } from "@/types";
import { apiGetPaginated } from "@/lib/api";

const BASE = "/kurir";

// ---- Job Marketplace ----
export async function getAvailableJobs(): Promise<ApiResponse<Job[]>> {
  return apiGet<Job[]>(`${BASE}/jobs/available`);
}

export async function getMyJobs(): Promise<ApiResponse<Job[]>> {
  return apiGet<Job[]>(`${BASE}/jobs/my`);
}

export async function acceptJob(jobId: string): Promise<ApiResponse<Job>> {
  return apiPost<Job>(`${BASE}/jobs/${jobId}/accept`, {});
}

export async function updateJobStatus(
  jobId: string,
  status: string
): Promise<ApiResponse<Job>> {
  return apiPut<Job>(`${BASE}/jobs/${jobId}/status`, { status });
}

// ---- Route Optimizer ----
export async function getOptimizedRoute(jobId: string): Promise<
  ApiResponse<{
    waypoints: { latitude: number; longitude: number; label: string }[];
    totalJarak: number;
    estimasiWaktu: number;
  }>
> {
  return apiGet(`${BASE}/jobs/${jobId}/optimized-route`);
}

// ---- Scan QR ----
export async function confirmDelivery(
  jobId: string,
  qrCode: string
): Promise<ApiResponse<Job>> {
  return apiPost<Job>(`${BASE}/jobs/${jobId}/confirm`, { qrCode });
}

// ---- Riwayat ----
export async function getRiwayatJob(
  page: number = 1
): Promise<PaginatedResponse<Job>> {
  return apiGetPaginated<Job>(`${BASE}/riwayat`, page);
}
