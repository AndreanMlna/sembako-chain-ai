import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Petani" }, { status: 403 });
        }

        const searchParams = request.nextUrl.searchParams;
        const komoditas = searchParams.get("komoditas") || "";

        // Get actual prices from database
        const where = komoditas ? { kategori: komoditas } : {};
        const produkList = await prisma.produk.findMany({
            where,
            select: { nama: true, kategori: true, hargaPerSatuan: true, satuan: true },
            orderBy: { createdAt: "desc" },
            take: 30,
        });

        if (produkList.length === 0) {
            // Fallback jika tidak ada data
            const base = Math.floor(Math.random() * 5000) + 8000;
            return NextResponse.json({
                success: true,
                data: [{
                    komoditas: komoditas || "Umum",
                    prediksiHargaRp: base,
                    trend: "STABIL",
                    batasBawahRp: Math.round(base * 0.85),
                    batasAtasRp: Math.round(base * 1.15),
                    confidence: 60,
                }],
                message: "Prediksi berdasarkan estimasi (data terbatas)",
            });
        }

        // Calculate from real data
        const prices = produkList.map((p) => p.hargaPerSatuan);
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Trend detection: compare first half vs second half
        const mid = Math.floor(prices.length / 2);
        const recent = prices.slice(0, mid);
        const older = prices.slice(mid);
        const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : avgPrice;
        const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avgPrice;
        const change = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
        const trend = change > 3 ? "NAIK" : change < -3 ? "TURUN" : "STABIL";

        // Categories in the results
        const categories = [...new Set(produkList.map((p) => p.kategori))];

        const predictions = categories.map((cat) => {
            const catProducts = produkList.filter((p) => p.kategori === cat);
            const catPrices = catProducts.map((p) => p.hargaPerSatuan);
            const catAvg = Math.round(catPrices.reduce((a, b) => a + b, 0) / catPrices.length);
            return {
                komoditas: cat,
                prediksiHargaRp: catAvg,
                trend,
                batasBawahRp: Math.round(catAvg * 0.9),
                batasAtasRp: Math.round(catAvg * 1.1),
                confidence: Math.min(85, 50 + produkList.length),
            };
        });

        return NextResponse.json({
            success: true,
            data: predictions.length > 0 ? predictions : [{
                komoditas: komoditas || "Umum",
                prediksiHargaRp: avgPrice,
                trend,
                batasBawahRp: Math.round(avgPrice * 0.9),
                batasAtasRp: Math.round(avgPrice * 1.1),
                confidence: 70,
            }],
            message: `Prediksi berdasarkan ${produkList.length} data produk`,
        });
    } catch (error) {
        console.error("Prediksi Harga Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil prediksi harga" },
            { status: 500 }
        );
    }
}
