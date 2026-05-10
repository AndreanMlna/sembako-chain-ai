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

        if (session.user.role !== "MITRA_TOKO") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Mitra Toko" },
                { status: 403 }
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

        // Total produk di inventory
        const totalProduk = await prisma.inventoryItem.count({
            where: { tokoId: toko.id },
        });

        // Ambil semua inventory untuk dihitung stok rendah
        const allItems = await prisma.inventoryItem.findMany({
            where: { tokoId: toko.id },
        });

        const lowStockItems = allItems.filter((item) => item.stok < item.minStok);
        const stokRendah = lowStockItems.length;

        // Total transaksi hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const transaksiHariIni = await prisma.transaksi.count({
            where: {
                createdAt: { gte: today },
            },
        });

        // Total pendapatan hari ini (uang masuk ke toko)
        const pendapatanResult = await prisma.transaksi.aggregate({
            where: {
                createdAt: { gte: today },
                penerimaId: session.user.id,
                status: "BERHASIL",
            },
            _sum: { jumlah: true },
        });

        // Low stock items detail with produk info
        const lowStockIds = lowStockItems.slice(0, 5).map((i) => i.id);
        const lowStockWithProduk = lowStockIds.length > 0
            ? await prisma.inventoryItem.findMany({
                where: { id: { in: lowStockIds } },
                include: {
                    produk: {
                        select: { id: true, nama: true, satuan: true },
                    },
                },
            })
            : [];

        return NextResponse.json({
            success: true,
            data: {
                totalProduk,
                stokRendah,
                transaksiHariIni,
                pendapatanHariIni: pendapatanResult._sum.jumlah || 0,
                lowStockItems: lowStockWithProduk,
            },
        });
    } catch (error: unknown) {
        console.error("GET Mitra Dashboard Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil data dashboard",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
