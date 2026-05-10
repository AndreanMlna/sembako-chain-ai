// src/app/api/petani/tanaman/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPanen, StatusKesehatan } from "@prisma/client";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
                { status: 401 }
            );
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Petani" },
                { status: 403 }
            );
        }


        const tanaman = await prisma.tanaman.findMany({
            where: {
                lahan: {
                    petaniId: session.user.id
                }
            },
            include: {
                lahan: {
                    select: {
                        nama: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: tanaman,
            message: "Data tanaman berhasil diambil"
        });

    } catch (error: unknown) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data tanaman" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { lahanId, nama, varietasNama, tanggalTanam, estimasiPanen } = body;

        if (!lahanId || !nama || !tanggalTanam) {
            return NextResponse.json(
                { success: false, message: "Data wajib (lahanId, nama, tanggalTanam) tidak lengkap" },
                { status: 400 }
            );
        }

        const lahanMilikPetani = await prisma.lahan.findFirst({
            where: {
                id: lahanId,
                petaniId: session.user.id
            }
        });

        if (!lahanMilikPetani) {
            return NextResponse.json(
                { success: false, message: "Lahan tidak ditemukan atau Anda tidak memiliki akses." },
                { status: 403 }
            );
        }

        // PERBAIKAN TS2322:
        // Karena skema mewajibkan Date, jika estimasiPanen kosong,
        // kita berikan default nilai tanggal hari ini (new Date()).
        const tanamanBaru = await prisma.tanaman.create({
            data: {
                nama,
                varietasNama: varietasNama || "",
                tanggalTanam: new Date(tanggalTanam),
                estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : new Date(tanggalTanam),
                statusPanen: StatusPanen.TANAM,
                statusKesehatan: StatusKesehatan.SEHAT,
                lahanId: lahanId,
            }
        });

        return NextResponse.json({
            success: true,
            data: tanamanBaru,
            message: "Tanaman berhasil didaftarkan!"
        });

    } catch (error: unknown) {
        console.error("Database Error:", error);

        let message = "Gagal menyimpan ke database";
        if (error instanceof Error) message = error.message;

        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}