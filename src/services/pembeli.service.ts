import { apiGet, apiPost, apiGetPaginated } from "@/lib/api";
import type { Produk, Order, ApiResponse, PaginatedResponse } from "@/types";
import type { OrderInput } from "@/lib/validators";

const BASE = "/pembeli";

// ---- Katalog ----
export async function getKatalog(params?: {
  kategori?: string;
  search?: string;
  sortBy?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
}): Promise<PaginatedResponse<Produk>> {
  const page = params?.page || 1;
  return apiGetPaginated<Produk>(`${BASE}/katalog`, page);
}

export async function getProdukDetail(id: string): Promise<ApiResponse<Produk>> {
  return apiGet<Produk>(`${BASE}/katalog/${id}`);
}

// ---- Pre-Order ----
export async function getPreOrderList(): Promise<ApiResponse<Produk[]>> {
  return apiGet<Produk[]>(`${BASE}/pre-order`);
}

export async function createPreOrder(
  produkId: string,
  jumlah: number
): Promise<ApiResponse<Order>> {
  return apiPost<Order>(`${BASE}/pre-order`, { produkId, jumlah });
}

// ---- Order ----
export async function createOrder(data: OrderInput): Promise<ApiResponse<Order>> {
  return apiPost<Order>(`${BASE}/order`, data);
}

export async function getMyOrders(
  page: number = 1
): Promise<PaginatedResponse<Order>> {
  return apiGetPaginated<Order>(`${BASE}/orders`, page);
}

export async function getOrderDetail(id: string): Promise<ApiResponse<Order>> {
  return apiGet<Order>(`${BASE}/orders/${id}`);
}

// ---- Tracking ----
export async function trackOrder(orderId: string): Promise<
  ApiResponse<{
    order: Order;
    kurirLocation?: { latitude: number; longitude: number };
    estimasiTiba: string;
  }>
> {
  return apiGet(`${BASE}/orders/${orderId}/track`);
}
