import { NextResponse } from "next/server";

/**
 * API Routes untuk Regulator (BI/Pemda)
 *
 * Sub-routes:
 * /api/regulator/inflasi - Inflation data & predictions
 * /api/regulator/heatmap - Stock heatmap data
 * /api/regulator/intervensi - Market intervention CRUD
 * /api/regulator/lapangan-kerja - Employment impact data
 * /api/regulator/laporan - Report generation
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "Regulator API endpoint",
    },
  });
}
