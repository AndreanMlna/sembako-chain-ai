import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusPanen } from "@prisma/client";

export async function POST(request: NextRequest) {
    try {
        const now = new Date();

        // Update status dari TANAM ke TUMBUH jika tanggalTanam sudah lewat
        await prisma.tanaman.updateMany({
            where: {
                statusPanen: StatusPanen.TANAM,
                tanggalTanam: {
                    lt: now,
                },
            },
            data: {
                statusPanen: StatusPanen.TUMBUH,
                updatedAt: now,
            },
        });

        // Update status dari TUMBUH ke SIAP_PANEN jika estimasiPanen sudah tercapai
        await prisma.tanaman.updateMany({
            where: {
                statusPanen: StatusPanen.TUMBUH,
                estimasiPanen: {
                    lte: now,
                },
            },
            data: {
                statusPanen: StatusPanen.SIAP_PANEN,
                updatedAt: now,
            },
        });

        // Update status dari SIAP_PANEN ke DIPANEN jika sudah 7 hari lewat estimasiPanen
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        await prisma.tanaman.updateMany({
            where: {
                statusPanen: StatusPanen.SIAP_PANEN,
                estimasiPanen: {
                    lt: sevenDaysAgo,
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
        });
    } catch (error) {
        console.error("Error updating tanaman status:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memperbarui status panen" },
            { status: 500 }
        );
    }
}</content>
<parameter name="filePath">D:\ATURSENDIRI\hackathon\sembako-chain-ai\src\app\api\petani\tanaman\update-status\route.ts
