import { apiGet, apiPost, apiPut, apiGetPaginated } from "@/lib/api";
import type {
  InventoryItem,
  Order,
  ApiResponse,
  PaginatedResponse,
} from "@/types";
import type { InventoryInput } from "@/lib/validators";

const BASE = "/mitra-toko";

// ---- Inventory ----
export async function getInventory(): Promise<ApiResponse<InventoryItem[]>> {
  return apiGet<InventoryItem[]>(`${BASE}/inventory`);
}

export async function updateInventoryItem(
  id: string,
  data: InventoryInput
): Promise<ApiResponse<InventoryItem>> {
  return apiPut<InventoryItem>(`${BASE}/inventory/${id}`, data);
}

export async function addInventoryItem(
  data: InventoryInput
): Promise<ApiResponse<InventoryItem>> {
  return apiPost<InventoryItem>(`${BASE}/inventory`, data);
}

// ---- Restock Alerts ----
export async function getRestockAlerts(): Promise<ApiResponse<InventoryItem[]>> {
  return apiGet<InventoryItem[]>(`${BASE}/restock-alerts`);
}

export async function requestRestock(
  produkId: string,
  jumlah: number
): Promise<ApiResponse<Order>> {
  return apiPost<Order>(`${BASE}/restock`, { produkId, jumlah });
}

// ---- POS ----
export async function createPOSTransaction(data: {
  items: { produkId: string; jumlah: number; harga: number }[];
  metodePembayaran: string;
}): Promise<ApiResponse<Order>> {
  return apiPost<Order>(`${BASE}/pos/transaction`, data);
}

// ---- Riwayat ----
export async function getRiwayatTransaksi(
  page: number = 1
): Promise<PaginatedResponse<Order>> {
  return apiGetPaginated<Order>(`${BASE}/riwayat`, page);
}
