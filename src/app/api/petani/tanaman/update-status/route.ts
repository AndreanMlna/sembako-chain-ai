// src/app/api/petani/tanaman/update-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

async function executeStatusUpdate(request: NextRequest) {
    try {
        // Proteksi Vercel Cron Secret (opsional di development, wajib di production jika CRON_SECRET terpasang)
        const cronSecret = process.env.CRON_SECRET;
        const authHeader = request.headers.get("authorization");

        if (process.env.NODE_ENV === "production" && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Invalid Cron Secret." },
                { status: 401 }
            );
        }

        const now = new Date();

        // Reset semua status berdasarkan kondisi waktu saat ini
        // 1. TANAM: jika tanggalTanam > sekarang
        await prisma.tanaman.updateMany({
            where: {
                tanggalTanam: {
                    gt: now,
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                },
            },
            data: {
                statusPanen: StatusPanen.TANAM,
                updatedAt: now,
            },
        });

        // 2. TUMBUH: jika tanggalTanam <= sekarang dan estimasiPanen > sekarang
        await prisma.tanaman.updateMany({
            where: {
                tanggalTanam: {
                    lte: now,
                },
                estimasiPanen: {
                    gt: now,
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                },
            },
            data: {
                statusPanen: StatusPanen.TUMBUH,
                updatedAt: now,
            },
        });

        // 3. SIAP_PANEN: jika estimasiPanen <= sekarang dan estimasiPanen > (sekarang - 7 hari)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: now,
                    gt: sevenDaysAgo,
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                },
            },
            data: {
                statusPanen: StatusPanen.SIAP_PANEN,
                updatedAt: now,
            },
        });

        // 4. DIPANEN: jika estimasiPanen + 7 hari <= sekarang (Otomatis panen jika dibiarkan)
        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: sevenDaysAgo,
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                },
            },
            data: {
                statusPanen: StatusPanen.DIPANEN,
                updatedAt: now,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Status panen tanaman berhasil diperbarui otomatis",
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error("Error updating tanaman status:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memperbarui status panen" },
            { status: 500 }
        );
    }
}

// Vercel Cron memanggil endpoint menggunakan method GET
export async function GET(request: NextRequest) {
    return executeStatusUpdate(request);
}

// Mendukung pemanggilan manual / trigger via POST
export async function POST(request: NextRequest) {
    return executeStatusUpdate(request);
}