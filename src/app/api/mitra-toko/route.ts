import { NextRequest, NextResponse } from "next/server";

/**
 * API Routes untuk Mitra Toko
 *
 * GET /api/mitra-toko - Get toko dashboard data
 * POST /api/mitra-toko - Create/update toko profile
 *
 * Sub-routes:
 * /api/mitra-toko/inventory - CRUD inventory
 * /api/mitra-toko/restock-alerts - Auto restock alerts
 * /api/mitra-toko/pos - POS transactions
 * /api/mitra-toko/riwayat - Transaction history
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Mitra Toko API endpoint",
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
