import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }
    const [
      totalLahan,
      totalTanamanAktif,
      totalSiapPanen,
      walletData,
      upcomingHarvests,
      recentActivities
    ] = await Promise.all([
<<<<<<< HEAD
      prisma.lahan.count({
        where: { petaniId: session.user.id }
      }),

      prisma.tanaman.count({
        where: {
          lahan: { petaniId: session.user.id },
=======
      // Total lahan
      prisma.lahan.count({
        where: { userId: session.user.id }
      }),

      prisma.tanaman.count({
        where: {
          lahan: { userId: session.user.id },
>>>>>>> 1b2700f (activate role petani)
          statusPanen: {
            in: [StatusPanen.TANAM, StatusPanen.TUMBUH, StatusPanen.SIAP_PANEN]
          }
          lahan: { userId: session.user.id },
>>>>>>> 1b2700f (activate role petani)
          statusPanen: StatusPanen.SIAP_PANEN
        }
      }),

=======
      // Wallet data
>>>>>>> 1b2700f (activate role petani)
        where: {
          lahan: { petaniId: session.user.id },
          statusPanen: StatusPanen.SIAP_PANEN
        },
      prisma.tanaman.findMany({
        where: {
          lahan: { userId: session.user.id },
          statusPanen: StatusPanen.SIAP_PANEN,
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
            statusPanen: StatusPanen.SIAP_PANEN,
        },
        orderBy: { estimasiPanen: 'asc' },
        take: 5
      }),

<<<<<<< HEAD
            lahan: true
          },
            { penerimaId: session.user.id }
          ]
        },
=======
      prisma.transaksi.findMany({
        where: { userId: session.user.id },
>>>>>>> 1b2700f (activate role petani)
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);
        totalSiapPanen,
        saldoWallet: walletData?.saldo || 0
      },
      upcomingHarvests: upcomingHarvests.map((harvest) => ({
        id: harvest.id,
        nama: harvest.nama,
        estimasiPanen: harvest.estimasiPanen,
        lahan: harvest.lahan?.nama || "Tanpa Nama",
        lokasi: harvest.lahan ? `${harvest.lahan.kecamatan}, ${harvest.lahan.kabupaten}` : "Lokasi N/A"
      })),
      recentActivities: recentActivities.map((activity) => {
        const isSender = activity.pengirimId === session.user.id;
        const amount = isSender ? -Number(activity.jumlah) : Number(activity.jumlah);

        let description;
        switch (activity.tipe) {
          case 'PEMBAYARAN':
            description = isSender ? 'Pembayaran pesanan' : 'Penerimaan pembayaran';
            break;
          case 'PENARIKAN':
            description = 'Penarikan dana';
            break;
          case 'TOP_UP':
            description = 'Top up wallet';
            break;
          case 'REFUND':
            description = 'Refund pembayaran';
            break;
          default:
            description = 'Transaksi';
        }

        return {
          id: activity.id,
          type: activity.tipe,
          amount,
          description,
          createdAt: activity.createdAt
        };
      })
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
