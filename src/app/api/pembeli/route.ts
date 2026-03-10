import { NextRequest, NextResponse } from "next/server";

/**
 * API Routes untuk Pembeli
 *
 * GET /api/pembeli - Get pembeli dashboard data
 *
 * Sub-routes:
 * /api/pembeli/katalog - Product catalog (location-based sorting)
 * /api/pembeli/pre-order - Pre-order upcoming harvests
 * /api/pembeli/order - Create/manage orders
 * /api/pembeli/orders - List orders
 * /api/pembeli/orders/[id]/track - Real-time tracking
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Pembeli API endpoint",
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
