import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

export async function POST() {
    try {
        const now = new Date();

        await prisma.tanaman.updateMany({
            where: {
                tanggalTanam: {
                    gt: now,
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
            },
            data: {
                statusPanen: StatusPanen.TANAM,
                updatedAt: now,
            },
        });

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
                }
            },
            data: {
                statusPanen: StatusPanen.TUMBUH,
                updatedAt: now,
            },
        });

        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: now,
                    gt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
                statusPanen: {
                    not: StatusPanen.DIPANEN,
                }
            },
            data: {
                statusPanen: StatusPanen.SIAP_PANEN,
                updatedAt: now,
            },
        });

        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        await prisma.tanaman.updateMany({
            where: {
                estimasiPanen: {
                    lte: sevenDaysAgo,
                },
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
