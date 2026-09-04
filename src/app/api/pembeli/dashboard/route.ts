// src/app/api/pembeli/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, StatusProduk } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const pembeliId = session.user.id;

    const [
      activeOrdersCount,
      shippingOrdersCount,
      completedOrders,
      recentOrdersRaw,
      nearbyProductsRaw,
    ] = await Promise.all([
      // Pesanan aktif (Pending / Confirmed)
      prisma.order.count({
        where: {
          pembeliId,
          status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
        },
      }),

      // Sedang dalam pengiriman
      prisma.order.count({
        where: {
          pembeliId,
          status: { in: [OrderStatus.PICKED_UP, OrderStatus.IN_TRANSIT] },
        },
      }),

      // Semua pesanan untuk hitung total belanja
      prisma.order.findMany({
        where: {
          pembeliId,
          status: { not: OrderStatus.CANCELLED },
        },
        select: {
          totalHarga: true,
          ongkosKirim: true,
        },
      }),

      // 5 Pesanan terbaru
      prisma.order.findMany({
        where: { pembeliId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
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
      }),

      // Produk terdekat / produk tersedia terbaru
      prisma.produk.findMany({
        where: {
          status: StatusProduk.TERSEDIA,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          petani: {
            select: {
              nama: true,
              kabupaten: true,
              kecamatan: true,
            },
          },
        },
      }),
    ]);

    const totalBelanja = completedOrders.reduce(
      (acc, curr) => acc + curr.totalHarga + curr.ongkosKirim,
      0
    );

    const recentOrders = recentOrdersRaw.map((order) => {
      const firstItem = order.items[0]?.produk?.nama || "Produk Pangan";
      const extraCount = order.items.length > 1 ? ` (+${order.items.length - 1} lainnya)` : "";

      return {
        id: order.id,
        item: `${firstItem}${extraCount}`,
        status: order.status,
        total: order.totalHarga + order.ongkosKirim,
        createdAt: order.createdAt,
      };
    });

    const nearbyProducts = nearbyProductsRaw.map((p) => ({
      id: p.id,
      name: p.nama,
      seller: p.petani?.nama || "Kelompok Tani",
      price: p.hargaPerSatuan,
      satuan: p.satuan,
      location: p.petani ? `${p.petani.kecamatan || ""}, ${p.petani.kabupaten || ""}` : "Jawa Timur",
      stock: p.stokTersedia,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activeOrders: activeOrdersCount,
          inShipping: shippingOrdersCount,
          totalSpent: totalBelanja,
          preOrders: 0,
        },
        recentOrders,
        nearbyProducts,
      },
      message: "Data dashboard pembeli berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Pembeli Dashboard Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard pembeli",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
