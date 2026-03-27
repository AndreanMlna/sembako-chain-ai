import axios from "axios";
import { ApiResponse, PaginatedResponse } from "@/types";

// Auto-fix: Memastikan selalu ada suffix "/api"
// Berjaga-jaga jika di file .env.local Anda hanya menulis "http://localhost:3000"
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
if (API_BASE_URL !== "/api" && !API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = `${API_BASE_URL}/api`;
}

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
      // Catatan: Jika menggunakan NextAuth dengan Session Strategy JWT/Cookies bawaan,
      // cookie otomatis terkirim, jadi Anda tidak wajib set Bearer token manual di sini
      // kecuali Anda menggunakan custom backend terpisah.
      return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Fitur Bantuan Debugging: Akan langsung memberitahu URL mana yang 404 di Console
      if (error.response?.status === 404) {
        const fullUrl = `${error.config?.baseURL}${error.config?.url}`;
        console.error(
            `[API 404 Error] Endpoint tidak ditemukan: ${fullUrl}\n` +
            `Solusi: Pastikan Anda telah membuat file di lokasi: src/app/api${error.config?.url}/route.ts`
        );
      }

      if (error.response?.status === 401) {
        // TODO: Redirect to login
        console.error("Unauthorized - redirect to login");
        // Anda bisa menggunakan window.location.href = '/login' di sini jika diperlukan
      }

      return Promise.reject(error);
    }
);

/**
 * Generic GET request
 */
export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data;
}

/**
 * Generic GET request with pagination
 */
export async function apiGetPaginated<T>(
    url: string,
    page: number = 1,
    limit: number = 20
): Promise<PaginatedResponse<T>> {
  const response = await apiClient.get<PaginatedResponse<T>>(url, {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Generic POST request
 */
export async function apiPost<T>(
    url: string,
    data: unknown
): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic PUT request
 */
export async function apiPut<T>(
    url: string,
    data: unknown
): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T>(
    url: string,
    data: unknown
): Promise<ApiResponse<T>> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
}

/**
 * Upload file
 */
export async function apiUpload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<T>>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
  return response.data;
}

export default apiClient;