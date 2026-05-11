import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "PEMBELI") {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }


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
