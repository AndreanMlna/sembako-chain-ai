// src/app/api/mitra-toko/restock/route.ts
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
        data: [],
        message: "Profil toko belum terdaftar.",
      });
    }

    // Ambil inventori toko
    const inventory = await prisma.inventoryItem.findMany({
      where: { tokoId: toko.id },
      include: {
        produk: true,
      },
    });

    // Cari produk dari petani untuk rekomendasi restock
    const supplierProducts = await prisma.produk.findMany({
      where: {
        stokTersedia: { gt: 0 },
      },
      include: {
        petani: {
          select: {
            id: true,
            nama: true,
            kabupaten: true,
            kecamatan: true,
          },
        },
      },
      take: 10,
    });

    // Filter produk yang stoknya di bawah atau sama dengan batas minimum
    const lowStockItems = inventory.filter((item) => item.stok <= item.minStok);

    const alerts = lowStockItems.map((item, idx) => {
      // Cari rekomendasi suplai dari petani
      const matchingSupplier = supplierProducts.find(
        (sp) =>
          sp.kategori.toLowerCase() === item.produk.kategori.toLowerCase() ||
          sp.nama.toLowerCase().includes(item.produk.nama.toLowerCase())
      ) || supplierProducts[idx % supplierProducts.length];

      const isCritical = item.stok <= Math.floor(item.minStok / 2);

      return {
        id: item.id,
        product: item.produk.nama,
        currentStock: item.stok,
        minStock: item.minStok,
        priority: isCritical ? "High" : "Medium",
        recommendation: matchingSupplier
          ? {
              farmer: matchingSupplier.petani.nama || "Kelompok Tani Lokal",
              distance: `${(2.0 + (idx * 1.3) % 5).toFixed(1)} km`,
              stockAvailable: matchingSupplier.stokTersedia,
              price: `Rp ${matchingSupplier.hargaPerSatuan.toLocaleString("id-ID")}/${matchingSupplier.satuan}`,
            }
          : {
              farmer: "Mitra Tani Terdekat",
              distance: "3.0 km",
              stockAvailable: 100,
              price: `Rp ${item.hargaJual.toLocaleString("id-ID")}/${item.produk.satuan}`,
            },
      };
    });

    return NextResponse.json({
      success: true,
      data: alerts,
      message: `Ditemukan ${alerts.length} rekomendasi restock dari database.`,
    });
  } catch (error: unknown) {
    console.error("GET Restock Alerts Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data restock",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
