import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "REGULATOR") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const [totalPetani, totalToko, totalKurir, totalProduk, totalOrders, totalTransaksi] = await Promise.all([
            prisma.user.count({ where: { role: "PETANI" } }),
            prisma.mitraToko.count(),
            prisma.kurirProfile.count(),
            prisma.produk.count(),
            prisma.order.count(),
            prisma.transaksi.count(),
        ]);

        // Harga rata-rata per komoditas
        const produkGrouped = await prisma.produk.groupBy({
            by: ["kategori"],
            _avg: { hargaPerSatuan: true },
            _count: true,
        });

        const inflasiData = produkGrouped.map((g) => ({
            komoditas: g.kategori,
            hargaRataRata: Math.round(g._avg.hargaPerSatuan || 0),
            jumlahProduk: g._count,
        }));

        return NextResponse.json({
            success: true,
            data: {
                totalPetani,
                totalToko,
                totalKurir,
                totalProduk,
                totalOrders,
                totalTransaksi,
                inflasiData,
            },
        });
    } catch (error) {
        console.error("Regulator Dashboard Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil data" }, { status: 500 });
    }
}
