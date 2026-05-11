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

        // Jobs that have no kurir assigned yet
        const jobs = await prisma.job.findMany({
            where: {
                kurirId: null,
                status: "PENDING",
            },
            include: {
                order: {
                    include: {
                        pembeli: {
                            select: { id: true, nama: true, latitude: true, longitude: true },
                        },
                        items: {
                            include: {
                                produk: {
                                    select: { id: true, nama: true, satuan: true, kategori: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const formatted = jobs.map((job) => ({
            id: job.id,
            orderId: job.orderId,
            estimasiJarak: job.estimasiJarak,
            estimasiWaktu: job.estimasiWaktu,
            ongkosKirim: job.ongkosKirim,
            status: job.status,
            createdAt: job.createdAt,
            pembeli: {
                id: job.order.pembeli.id,
                nama: job.order.pembeli.nama,
                latitude: job.order.pembeli.latitude,
                longitude: job.order.pembeli.longitude,
            },
            items: job.order.items.map((i) => ({
                nama: i.produk.nama,
                satuan: i.produk.satuan,
                kategori: i.produk.kategori,
                jumlah: i.jumlah,
            })),
            alamatPengiriman: job.order.alamatPengiriman,
            totalHarga: job.order.totalHarga,
        }));

        return NextResponse.json({
            success: true,
            data: formatted,
            message: formatted.length > 0 ? `${formatted.length} job tersedia` : "Tidak ada job tersedia",
        });
    } catch (error) {
        console.error("GET Available Jobs Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data job" },
            { status: 500 }
        );
    }
}
