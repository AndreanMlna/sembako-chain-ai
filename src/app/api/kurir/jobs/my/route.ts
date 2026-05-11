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
        if (session.user.role !== "KURIR") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Kurir" }, { status: 403 });
        }

        const jobs = await prisma.job.findMany({
            where: { kurirId: session.user.id },
            include: {
                order: {
                    include: {
                        pembeli: {
                            select: { id: true, nama: true, telepon: true, latitude: true, longitude: true },
                        },
                        items: {
                            include: {
                                produk: {
                                    select: { id: true, nama: true, satuan: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        const formatted = jobs.map((job) => ({
            id: job.id,
            orderId: job.orderId,
            estimasiJarak: job.estimasiJarak,
            estimasiWaktu: job.estimasiWaktu,
            ongkosKirim: job.ongkosKirim,
            status: job.status,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            pembeli: {
                id: job.order.pembeli.id,
                nama: job.order.pembeli.nama,
                telepon: job.order.pembeli.telepon,
            },
            items: job.order.items.map((i) => ({
                nama: i.produk.nama,
                satuan: i.produk.satuan,
                jumlah: i.jumlah,
            })),
            alamatPengiriman: job.order.alamatPengiriman,
        }));

        return NextResponse.json({
            success: true,
            data: formatted,
        });
    } catch (error) {
        console.error("GET My Jobs Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data job" },
            { status: 500 }
        );
    }
}
