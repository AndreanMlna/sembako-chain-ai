// src/app/api/mitra-toko/dashboard/route.ts
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

    const toko = await prisma.mitraToko.findUnique({
      where: { userId: session.user.id },
    });

    if (!toko) {
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalProduk: 0,
            stokRendah: 0,
            penjualanHariIni: 0,
            orderMasuk: 0,
          },
          lowStockProducts: [],
          recentSales: [],
        },
        message: "Toko belum terdaftar, menampilkan dashboard awal.",
      });
    }

    // Ambil seluruh inventori toko untuk kalkulasi dinamis
    const inventory = await prisma.inventoryItem.findMany({
      where: { tokoId: toko.id },
      include: {
        produk: true,
      },
      orderBy: { stok: "asc" },
    });

    const lowStockItems = inventory
      .filter((item) => item.stok <= item.minStok)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.produk?.nama || "Produk",
        stock: item.stok,
        minStock: item.minStok,
        hargaJual: item.hargaJual,
        satuan: item.produk?.satuan || "kg",
      }));

    // Ambil transaksi penerimaan pembayaran toko
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transaksiToko = await prisma.transaksi.findMany({
      where: {
        penerimaId: session.user.id,
        status: "BERHASIL",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const penjualanHariIni = transaksiToko
      .filter((t) => new Date(t.createdAt) >= today)
      .reduce((acc, curr) => acc + curr.jumlah, 0);

    const recentSales = transaksiToko.map((t) => ({
      id: t.id,
      items: 1,
      total: t.jumlah,
      createdAt: t.createdAt,
      tipe: t.tipe,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProduk: inventory.length,
          stokRendah: lowStockItems.length,
          penjualanHariIni,
          orderMasuk: transaksiToko.length,
        },
        lowStockProducts: lowStockItems,
        recentSales,
      },
      message: "Data dashboard toko berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Toko Dashboard Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard toko",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
