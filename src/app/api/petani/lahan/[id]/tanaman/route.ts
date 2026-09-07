import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatusPanen, StatusKesehatan } from "@prisma/client";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Petani" },
                { status: 403 }
            );
        }


        const { id: lahanId } = await context.params;
        const body = await request.json();

        // Validasi kepemilikan lahan (Optimasi: hanya select id)
        const lahanExist = await prisma.lahan.findFirst({
            where: { id: lahanId, petaniId: session.user.id },
            select: { id: true }
        });

        if (!lahanExist) {
            return NextResponse.json({ success: false, message: "Lahan tidak ditemukan" }, { status: 404 });
        }

        const tanamanBaru = await prisma.tanaman.create({
            data: {
                nama: body.nama,
                varietasNama: body.varietasNama,
                tanggalTanam: new Date(body.tanggalTanam),
                estimasiPanen: body.estimasiPanen ? new Date(body.estimasiPanen) : new Date(),
                statusPanen: StatusPanen.TANAM,
                statusKesehatan: StatusKesehatan.SEHAT,
                lahanId: lahanId,
            }
        });

        return NextResponse.json({ success: true, data: tanamanBaru, message: "Tanaman berhasil didaftarkan!" });
    } catch (error: unknown) {
        console.error("Database Error:", error);
        return NextResponse.json({ success: false, message: "Gagal menyimpan data" }, { status: 500 });
    }
}