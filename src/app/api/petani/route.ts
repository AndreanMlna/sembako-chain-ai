import { NextRequest, NextResponse } from "next/server";

/**
 * API Routes untuk Petani
 *
 * GET /api/petani - Get petani dashboard data
 * POST /api/petani - Create/update petani profile
 *
 * Sub-routes:
 * /api/petani/lahan - CRUD lahan
 * /api/petani/tanaman - CRUD tanaman
 * /api/petani/crop-check - AI crop check
 * /api/petani/produk - CRUD produk penjualan
 * /api/petani/wallet - E-wallet operations
 */

export async function GET() {
  // TODO: Implement with database
  return NextResponse.json({
    success: true,
    data: {
      message: "Petani API endpoint",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: Implement petani profile creation/update
  return NextResponse.json({
    success: true,
    data: body,
  });
}
