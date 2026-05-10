import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const toko = await prisma.mitraToko.findUnique({
            where: { userId: session.user.id },
        });

        if (!toko) {
            return NextResponse.json(
                { success: false, message: "Profil toko tidak ditemukan" },
                { status: 404 }
            );
        }

        // Get all inventory items for this toko
        const items = await prisma.inventoryItem.findMany({
            where: { tokoId: toko.id },
            include: {
                produk: {
                    include: {
                        petani: {
                            select: {
                                id: true,
                                nama: true,
                                latitude: true,
                                longitude: true,
                            },
                        },
                    },
                },
            },
            orderBy: { stok: "asc" },
        });

        // Filter items with stok below minStok
        const alerts = items
            .filter((item) => item.stok < item.minStok)
            .map((item) => {
                const shortage = item.minStok - item.stok;
                const percentage = Math.round((item.stok / item.minStok) * 100);
                const severity = item.stok === 0 ? "danger" : "warning";

                return {
                    id: item.id,
                    produkId: item.produkId,
                    produkNama: item.produk.nama,
                    kategori: item.produk.kategori,
                    satuan: item.produk.satuan,
                    stok: item.stok,
                    minStok: item.minStok,
                    shortage,
                    percentage,
                    severity,
                    hargaJual: item.hargaJual,
                    petani: item.produk.petani
                        ? {
                              id: item.produk.petani.id,
                              nama: item.produk.petani.nama,
                              latitude: item.produk.petani.latitude,
                              longitude: item.produk.petani.longitude,
                          }
                        : null,
                };
            });

        return NextResponse.json({
            success: true,
            data: alerts,
            message:
                alerts.length > 0
                    ? `Ditemukan ${alerts.length} produk perlu restock`
                    : "Semua stok aman",
        });
    } catch (error: unknown) {
        console.error("GET Restock Alerts Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil data restock alerts",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
