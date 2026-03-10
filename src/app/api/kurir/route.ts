import { NextRequest, NextResponse } from "next/server";

/**
 * API Routes untuk Kurir
 *
 * GET /api/kurir - Get kurir dashboard data
 * POST /api/kurir - Create/update kurir profile
 *
 * Sub-routes:
 * /api/kurir/jobs - Job marketplace (available, my jobs, accept)
 * /api/kurir/route-optimizer - AI route optimization
 * /api/kurir/confirm - QR scan delivery confirmation
 * /api/kurir/riwayat - Job history
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Kurir API endpoint",
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
