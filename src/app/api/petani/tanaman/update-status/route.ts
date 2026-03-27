// src/app/api/petani/tanaman/update-status/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

export async function POST() {
    try {
        const now = new Date();

        // Reset semua status berdasarkan kondisi waktu saat ini
        // 1. TANAM: jika tanggalTanam > sekarang
        await prisma.tanaman.updateMany({
            where: {
                tanggalTanam: {
                    gt: now,
                },
                // Tambahan: Abaikan tanaman yang sudah dipanen manual
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
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
                // Tambahan: Abaikan tanaman yang sudah dipanen manual lebih awal
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
            },
            data: {
                statusPanen: StatusPanen.TUMBUH,
                updatedAt: now,
            },
        });

        // 3. SIAP_PANEN: jika estimasiPanen <= sekarang dan estimasiPanen > (sekarang - 7 hari)
        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: now,
                    gt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
                // Tambahan: Jangan kembalikan status menjadi SIAP_PANEN jika sudah di-klik panen
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
            },
            data: {
                statusPanen: StatusPanen.SIAP_PANEN,
                updatedAt: now,
            },
        });

        // 4. DIPANEN: jika estimasiPanen + 7 hari <= sekarang (Otomatis panen jika dibiarkan)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: sevenDaysAgo,
                },
                // Tambahan: Hindari database melakukan update berulang pada data yang sudah DIPANEN
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
            },
            data: {
                statusPanen: StatusPanen.DIPANEN,
                updatedAt: now,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Status panen tanaman berhasil diperbarui otomatis",
        });
    } catch (error) {
        console.error("Error updating tanaman status:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memperbarui status panen" },
            { status: 500 }
        );
    }
}