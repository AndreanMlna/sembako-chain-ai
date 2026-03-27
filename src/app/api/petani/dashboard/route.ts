import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

/**
 * API Route untuk Dashboard Petani
 *
 * GET /api/petani/dashboard - Get dashboard statistics
 */

export async function GET() {
  try {
    // Memastikan user sudah login
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Mengambil statistik dashboard petani
    const [
      totalLahan,
      totalTanamanAktif,
      totalSiapPanen,
      walletData,
      upcomingHarvests,
      recentActivities
    ] = await Promise.all([
      // Total lahan
      prisma.lahan.count({
        where: { userId: session.user.id }
      }),

      // Total tanaman aktif (TANAM, TUMBUH, SIAP_PANEN)
      prisma.tanaman.count({
        where: {
          lahan: { userId: session.user.id },
          statusPanen: {
            in: [StatusPanen.TANAM, StatusPanen.TUMBUH, StatusPanen.SIAP_PANEN]
          }
        }
      }),

      // Total siap panen
      prisma.tanaman.count({
        where: {
          lahan: { userId: session.user.id },
          statusPanen: StatusPanen.SIAP_PANEN
        }
      }),

      // Wallet data
      prisma.eWallet.findUnique({
        where: { userId: session.user.id }
      }),

      // Upcoming harvests (next 7 days)
      prisma.tanaman.findMany({
        where: {
          lahan: { userId: session.user.id },
          statusPanen: StatusPanen.SIAP_PANEN,
          estimasiPanen: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          lahan: {
            select: { nama: true, lokasi: true }
          }
        },
        orderBy: { estimasiPanen: 'asc' },
        take: 5
      }),

      // Recent activities (last 10 transactions)
      prisma.transaksi.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    const dashboardData = {
      stats: {
        totalLahan,
        totalTanamanAktif,
        totalSiapPanen,
        saldoWallet: walletData?.saldo || 0
      },
      upcomingHarvests: upcomingHarvests.map(harvest => ({
        id: harvest.id,
        nama: harvest.nama,
        estimasiPanen: harvest.estimasiPanen,
        lahan: harvest.lahan.nama,
        lokasi: `${harvest.lahan.lokasi?.kecamatan}, ${harvest.lahan.lokasi?.kabupaten}`
      })),
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        type: activity.type,
        amount: activity.amount,
        description: activity.description,
        createdAt: activity.createdAt
      }))
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: "Data dashboard berhasil diambil"
    });
  } catch (error) {
    console.error("GET Dashboard Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data dashboard", error: String(error) },
      { status: 500 }
    );
  }
}
