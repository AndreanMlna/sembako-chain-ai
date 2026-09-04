// src/app/api/mitra-toko/transaksi/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Ambil transaksi yang melibatkan mitra toko (sebagai penerima pembayaran penjualan)
    const list = await prisma.transaksi.findMany({
      where: {
        OR: [
          { penerimaId: session.user.id },
          { pengirimId: session.user.id },
        ],
      },
      include: {
        order: {
          include: {
            pembeli: {
              select: {
                id: true,
                nama: true,
              },
            },
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const formatted = list.map((t) => {
      const createdDate = new Date(t.createdAt);
      const isSuccess = t.status === "BERHASIL";
      const isFailed = t.status === "GAGAL";

      let statusDisplay = "Selesai";
      if (isFailed) statusDisplay = "Dibatalkan";
      else if (!isSuccess) statusDisplay = "Pending";

      let paymentDisplay = "E-Wallet";
      if (t.tipe === "PEMBAYARAN") paymentDisplay = "Transfer";

      return {
        id: t.referensi || `TRX-${t.id.slice(-4).toUpperCase()}`,
        date: createdDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: createdDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        customer: t.order?.pembeli?.nama || "Pelanggan Umum",
        total: t.jumlah,
        items: t.order?.items?.length || 1,
        status: statusDisplay,
        payment: paymentDisplay,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      message: `Berhasil mengambil ${formatted.length} riwayat transaksi`,
    });
  } catch (error: unknown) {
    console.error("GET Mitra Toko Transaksi Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data riwayat transaksi",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
