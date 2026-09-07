import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "KURIR") {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }


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
