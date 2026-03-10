import { NextRequest, NextResponse } from "next/server";

/**
 * API Routes untuk Produk
 *
 * GET /api/produk - Get products (with filtering, sorting, pagination)
 * POST /api/produk - Create new product
 *
 * Query params:
 * - kategori: filter by category
 * - search: search by name
 * - sortBy: price, distance, freshness
 * - lat, lng: for distance-based sorting
 * - page, limit: pagination
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Produk API endpoint",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: body,
  });
}
