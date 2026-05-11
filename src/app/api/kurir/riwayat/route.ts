import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (session.user.role !== "KURIR") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const jobs = await prisma.job.findMany({
            where: { kurirId: session.user.id, status: "DELIVERED" },
            include: {
                order: {
                    include: {
                        pembeli: { select: { nama: true } },
                        items: { include: { produk: { select: { nama: true } } } },
                    },
                },
            },
            orderBy: { updatedAt: "desc" }, take: 30,
        });

        const totalPendapatan = jobs.reduce((acc, j) => acc + j.ongkosKirim, 0);

        return NextResponse.json({
            success: true,
            data: {
                totalPengiriman: jobs.length,
                totalPendapatan,
                riwayat: jobs.map((j) => ({
                    id: j.id, orderId: j.orderId, ongkosKirim: j.ongkosKirim,
                    estimasiJarak: j.estimasiJarak, status: j.status, updatedAt: j.updatedAt,
                    pembeli: j.order.pembeli.nama,
                    items: j.order.items.map((i) => i.produk.nama).join(", "),
                })),
            },
        });
    } catch (error) {
        console.error("Kurir Riwayat Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil riwayat" }, { status: 500 });
    }
}
