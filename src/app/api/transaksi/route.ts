import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * API Routes untuk Transaksi
 *
 * GET /api/transaksi - Get transactions (filtered by user)
 * POST /api/transaksi - Create new transaction
 *
 * Handles: payments, withdrawals, top-ups, refunds
 */

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }


  return NextResponse.json({
    success: true,
    data: {
      message: "Transaksi API endpoint",
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
