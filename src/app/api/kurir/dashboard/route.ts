// src/app/api/kurir/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const kurirId = session.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      availableJobsCount,
      kurirProfile,
      kurirUser,
      activeJobsRaw,
      completedJobs,
    ] = await Promise.all([
      // Job tersedia di marketplace
      prisma.job.count({
        where: {
          kurirId: null,
          status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
        },
      }),

      // Profil kurir (Rating & Kendaraan)
      prisma.kurirProfile.findUnique({
        where: { userId: kurirId },
      }),

      // Profil data kurir (lokasi base & alamat kurir)
      prisma.user.findUnique({
        where: { id: kurirId },
        select: {
          nama: true,
          jalan: true,
          kecamatan: true,
          kabupaten: true,
          latitude: true,
          longitude: true,
        },
      }),

      // Job-job yang sedang aktif dibawa kurir
      prisma.job.findMany({
        where: {
          kurirId,
          status: { in: [OrderStatus.PICKED_UP, OrderStatus.IN_TRANSIT] },
        },
        include: {
          order: {
            include: {
              pembeli: {
                select: {
                  nama: true,
                  jalan: true,
                  kecamatan: true,
                  kabupaten: true,
                  telepon: true,
                  latitude: true,
                  longitude: true,
                },
              },
              items: {
                include: {
                  produk: {
                    select: {
                      nama: true,
                      satuan: true,
                      petani: {
                        select: {
                          nama: true,
                          jalan: true,
                          kecamatan: true,
                          kabupaten: true,
                          latitude: true,
                          longitude: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),

      // Riwayat pengiriman selesai
      prisma.job.findMany({
        where: {
          kurirId,
          status: OrderStatus.DELIVERED,
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          order: {
            include: {
              pembeli: {
                select: {
                  nama: true,
                  kecamatan: true,
                  telepon: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const deliveriesToday = completedJobs.filter(
      (job) => new Date(job.updatedAt) >= today
    ).length;

    const earningsToday = completedJobs
      .filter((job) => new Date(job.updatedAt) >= today)
      .reduce((acc, curr) => acc + curr.ongkosKirim, 0);

    const kurirBase = {
      address: kurirUser?.jalan
        ? `${kurirUser.jalan}, ${kurirUser.kecamatan || ""}, ${kurirUser.kabupaten || "Bandung"}`.replace(/^,\s*|,\s*$/g, "").trim()
        : "Jl. Pasirkaliki No. 25, Cicendo, Bandung",
      lat: kurirUser?.latitude || -6.9107,
      lng: kurirUser?.longitude || 107.5982,
    };

    const activeJobs = activeJobsRaw.map((job) => {
      // Titik Jemput: Diambil langsung dari lokasi Petani/Produsen komoditas terkait
      const seller = job.order.items[0]?.produk?.petani;
      const pickupAddr = seller?.jalan
        ? `${seller.nama ? `Kebun ${seller.nama}, ` : ""}${seller.jalan}, ${seller.kecamatan || ""}, ${seller.kabupaten || "Bandung"}`.replace(/^,\s*|,\s*$/g, "").trim()
        : "Sentra Distribusi Pangan Lembang, Bandung";
      
      const pickupLat = seller?.latitude || -6.8115;
      const pickupLng = seller?.longitude || 107.6169;

      // Titik Antar (Dropoff): Diambil langsung dari alamat pesanan/pembeli
      const dropoffAddr =
        job.order.alamatPengiriman ||
        `${job.order.pembeli.jalan || ""}, ${job.order.pembeli.kecamatan || ""}, ${job.order.pembeli.kabupaten || "Bandung"}`.replace(/^,\s*|,\s*$/g, "").trim() ||
        "Alamat Penerima, Bandung";
      
      const dropoffLat = job.order.latitude || job.order.pembeli.latitude || -6.8934;
      const dropoffLng = job.order.longitude || job.order.pembeli.longitude || 107.6106;

      return {
        id: job.id,
        orderId: job.orderId,
        from: pickupAddr,
        to: dropoffAddr,
        pickup: pickupAddr,
        dropoff: dropoffAddr,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        lat: dropoffLat,
        lng: dropoffLng,
        estimasiJarak: job.estimasiJarak || 4.2,
        estimasiWaktu: job.estimasiWaktu || 15,
        distance: job.estimasiJarak ? `${job.estimasiJarak} km` : "Dalam Kota",
        rawStatus: job.status,
        status: job.status === OrderStatus.IN_TRANSIT ? "Dalam Perjalanan" : "Diambil",
        items: job.order.items.map((i) => `${i.jumlah} ${i.produk.nama}`).join(", "),
        recipientName: job.order.pembeli.nama,
        recipientPhone: job.order.pembeli.telepon || "0812-3456-7890",
      };
    });

    const activeJob = activeJobs.length > 0 ? activeJobs[0] : null;

    const recentDeliveries = completedJobs.slice(0, 5).map((job) => ({
      id: job.id,
      dest: job.order.pembeli.nama || "Pelanggan",
      time: new Date(job.updatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      fee: job.ongkosKirim,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          availableJobs: availableJobsCount,
          deliveriesToday,
          rating: kurirProfile?.rating || 5.0,
          earningsToday,
        },
        kurirBase,
        activeJob,
        activeJobs,
        recentDeliveries,
      },
      message: "Data dashboard kurir berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Kurir Dashboard Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard kurir",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
