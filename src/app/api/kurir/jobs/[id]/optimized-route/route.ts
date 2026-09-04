// src/app/api/kurir/jobs/[id]/optimized-route/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Formula Spasial Haversine Murni (HTML5 Geolocation Tracking Skill)
function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id: jobId } = await params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        kurir: {
          select: {
            id: true,
            nama: true,
            jalan: true,
            kecamatan: true,
            kabupaten: true,
            latitude: true,
            longitude: true,
          },
        },
        order: {
          include: {
            pembeli: {
              select: {
                id: true,
                nama: true,
                jalan: true,
                kecamatan: true,
                kabupaten: true,
                latitude: true,
                longitude: true,
                telepon: true,
              },
            },
            items: {
              include: {
                produk: {
                  select: {
                    nama: true,
                    petani: {
                      select: {
                        id: true,
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
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Pekerjaan pengantaran tidak ditemukan." },
        { status: 404 }
      );
    }

    const seller = job.order.items[0]?.produk?.petani;
    const buyer = job.order.pembeli;
    const courier = job.kurir;

    // Titik Jemput: Petani / Produsen Komoditas
    const pickupLat = seller?.latitude || -6.8115;
    const pickupLng = seller?.longitude || 107.6169;
    const pickupLabel = seller?.jalan
      ? `${seller.nama ? `Kebun ${seller.nama}, ` : ""}${seller.jalan}, ${seller.kecamatan || ""}, ${seller.kabupaten || "Bandung"}`.replace(/^,\s*|,\s*$/g, "").trim()
      : "Sentra Distribusi Pertanian Lembang, Bandung";

    // Titik Antar: Penerima / Pembeli
    const dropoffLat = job.order.latitude || buyer?.latitude || -6.8934;
    const dropoffLng = job.order.longitude || buyer?.longitude || 107.6106;
    const dropoffLabel =
      job.order.alamatPengiriman ||
      `${buyer?.jalan || ""}, ${buyer?.kecamatan || ""}, ${buyer?.kabupaten || "Bandung"}`.replace(/^,\s*|,\s*$/g, "").trim() ||
      "Jl. Ir. H. Juanda No. 120, Bandung";

    // Posisi Kurir Terkini / Pangkalan Kurir
    const courierLat = courier?.latitude || -6.9107;
    const courierLng = courier?.longitude || 107.5982;
    const courierLabel = courier?.jalan
      ? `Kurir: ${courier.jalan}, ${courier.kabupaten || "Bandung"}`
      : "Pangkalan Kurir Cicendo, Bandung";

    // Waypoints Rute Logistik Terpadu
    const waypoints = [
      {
        latitude: pickupLat,
        longitude: pickupLng,
        label: pickupLabel,
        type: "PICKUP",
      },
      {
        latitude: courierLat,
        longitude: courierLng,
        label: courierLabel,
        type: "COURIER_POSITION",
      },
      {
        latitude: dropoffLat,
        longitude: dropoffLng,
        label: dropoffLabel,
        type: "DROPOFF",
      },
    ];

    const distCourierToDropoff = calculateHaversineKm(
      courierLat,
      courierLng,
      dropoffLat,
      dropoffLng
    );
    const distPickupToDropoff = calculateHaversineKm(
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng
    );

    const totalJarak = job.estimasiJarak || distCourierToDropoff || distPickupToDropoff;
    const estimasiWaktu = Math.max(5, Math.round((totalJarak / 32) * 60)); // Rata-rata 32 km/jam dalam kota

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        waypoints,
        totalJarak,
        estimasiWaktu,
        pickup: {
          name: pickupLabel,
          latitude: pickupLat,
          longitude: pickupLng,
        },
        dropoff: {
          name: dropoffLabel,
          latitude: dropoffLat,
          longitude: dropoffLng,
        },
        courier: {
          name: courier?.nama || "Kurir Sembako",
          latitude: courierLat,
          longitude: courierLng,
        },
      },
      message: "Rute optimasi kurir berhasil dihasilkan",
    });
  } catch (error: unknown) {
    console.error("GET Kurir Optimized Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghasilkan rute optimasi",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
