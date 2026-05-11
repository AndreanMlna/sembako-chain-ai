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
        if (session.user.role !== "PETANI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Petani" }, { status: 403 });
        }

        const history = await prisma.hasilCropCheck.findMany({
            where: { userId: session.user.id },
            include: {
                tanaman: {
                    select: { id: true, nama: true, varietasNama: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json({
            success: true,
            data: history.map((h) => ({
                id: h.id,
                fotoUrl: h.fotoUrl,
                diagnosa: h.hasilDiagnosa,
                tingkatKeparahan: h.tingkatKeparahan,
                solusi: h.solusi,
                statusKesehatan: h.statusKesehatan,
                createdAt: h.createdAt,
                tanaman: h.tanaman
                    ? { id: h.tanaman.id, nama: h.tanaman.nama, varietas: h.tanaman.varietasNama }
                    : null,
            })),
        });
    } catch (error) {
        console.error("Crop Check History Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil riwayat diagnosa" },
            { status: 500 }
        );
    }
}
