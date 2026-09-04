// src/app/api/kurir/jobs/history/route.ts
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

    // Ambil pekerjaan pengiriman yang pernah ditangani kurir ini
    const jobs = await prisma.job.findMany({
      where: {
        kurirId: session.user.id,
      },
      include: {
        order: {
          include: {
            pembeli: {
              select: {
                id: true,
                nama: true,
                kabupaten: true,
                kecamatan: true,
                jalan: true,
              },
            },
            items: {
              include: {
                produk: {
                  select: {
                    nama: true,
                    satuan: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const formatted = jobs.map((job) => {
      const createdDate = new Date(job.updatedAt);
      const itemsSummary =
        job.order.items.length > 0
          ? `${job.order.items[0].jumlah} ${job.order.items[0].produk.satuan} ${job.order.items[0].produk.nama}${
              job.order.items.length > 1 ? ` (+${job.order.items.length - 1} item)` : ""
            }`
          : "Komoditas Pangan";

      const dropoffLoc =
        [job.order.pembeli?.kecamatan, job.order.pembeli?.kabupaten]
          .filter(Boolean)
          .join(", ") || "Alamat Pembeli";

      let statusDisplay = "Selesai";
      if (job.status === "IN_TRANSIT" || job.status === "PICKED_UP") statusDisplay = "Sedang Dikirim";
      else if (job.status === "PENDING" || job.status === "CONFIRMED") statusDisplay = "Proses";

      return {
        id: `DEL-${job.id.slice(-4).toUpperCase()}`,
        date: createdDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: createdDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        store: "Mitra Distribusi Pangan",
        item: itemsSummary,
        pickup: "Gudang Sentra Tani",
        dropoff: dropoffLoc,
        fee: job.ongkosKirim || 25000,
        distance: `${(job.estimasiJarak || 3.5).toFixed(1)} km`,
        status: statusDisplay,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      message: `Berhasil mengambil ${formatted.length} riwayat pengiriman`,
    });
  } catch (error: unknown) {
    console.error("GET Kurir History Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data riwayat kurir",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
