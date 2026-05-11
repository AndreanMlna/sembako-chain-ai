import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (session.user.role !== "PEMBELI") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const tanaman = await prisma.tanaman.findMany({
            where: { statusPanen: { in: ["TUMBUH", "SIAP_PANEN"] } },
            include: {
                lahan: {
                    include: {
                        petani: { select: { id: true, nama: true, latitude: true, longitude: true } },
                    },
                },
            },
            orderBy: { estimasiPanen: "asc" },
            take: 20,
        });

        const formatted = tanaman.map((t) => {
            const now = new Date();
            const daysUntilHarvest = Math.ceil((t.estimasiPanen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const progress = t.statusPanen === "SIAP_PANEN" ? 90 : Math.min(85, Math.max(10, ((90 - daysUntilHarvest) / 90) * 100));
            return {
                id: t.id,
                nama: t.nama,
                varietas: t.varietasNama,
                statusPanen: t.statusPanen,
                estimasiPanen: t.estimasiPanen,
                hariKePanen: daysUntilHarvest,
                progress: Math.round(progress),
                petani: {
                    id: t.lahan.petani.id,
                    nama: t.lahan.petani.nama,
                    latitude: t.lahan.petani.latitude,
                    longitude: t.lahan.petani.longitude,
                },
                lahan: { id: t.lahan.id, nama: t.lahan.nama },
            };
        });

        return NextResponse.json({ success: true, data: formatted });
    } catch (error) {
        console.error("Pre-order Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil data pre-order" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (session.user.role !== "PEMBELI") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const { tanamanId, jumlah } = body;

        const tanaman = await prisma.tanaman.findUnique({
            where: { id: tanamanId },
            include: { lahan: { include: { petani: true } } },
        });

        if (!tanaman) return NextResponse.json({ success: false, message: "Tanaman tidak ditemukan" }, { status: 404 });

        const estimasiHarga = (tanaman.jumlahKg || 10) * (jumlah || 1) * 10000;

        return NextResponse.json({
            success: true,
            data: {
                tanamanId: tanaman.id,
                tanamanNama: tanaman.nama,
                petaniNama: tanaman.lahan.petani.nama,
                estimasiPanen: tanaman.estimasiPanen,
                jumlah: jumlah || 1,
                estimasiHarga,
            },
            message: `Pre-order ${tanaman.nama} berhasil dibuat. Estimasi panen: ${tanaman.estimasiPanen.toLocaleDateString("id-ID")}`,
        });
    } catch (error) {
        console.error("Pre-order POST Error:", error);
        return NextResponse.json({ success: false, message: "Gagal membuat pre-order" }, { status: 500 });
    }
}
