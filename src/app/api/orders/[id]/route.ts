import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        produk: {
                            select: { id: true, nama: true, satuan: true, kategori: true, fotoUrl: true },
                        },
                    },
                },
                job: {
                    include: {
                        kurir: { select: { id: true, nama: true, telepon: true } },
                    },
                },
                pembeli: { select: { id: true, nama: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order tidak ditemukan" }, { status: 404 });
        }

        // Only pembeli, kurir assigned to job, or admin can view
        const isOwner = order.pembeliId === session.user.id;
        const isKurir = order.job?.kurirId === session.user.id;
        if (!isOwner && !isKurir) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: order.id,
                status: order.status,
                totalHarga: order.totalHarga,
                ongkosKirim: order.ongkosKirim,
                alamatPengiriman: order.alamatPengiriman,
                metodeJual: order.metodeJual,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                pembeli: order.pembeli,
                items: order.items.map((i) => ({
                    id: i.id,
                    produkId: i.produkId,
                    nama: i.produk.nama,
                    satuan: i.produk.satuan,
                    kategori: i.produk.kategori,
                    jumlah: i.jumlah,
                    harga: i.harga,
                    subtotal: i.subtotal,
                })),
                job: order.job
                    ? {
                          id: order.job.id,
                          status: order.job.status,
                          estimasiJarak: order.job.estimasiJarak,
                          estimasiWaktu: order.job.estimasiWaktu,
                          kurir: order.job.kurir,
                      }
                    : null,
            },
        });
    } catch (error) {
        console.error("GET Order Detail Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil detail order" },
            { status: 500 }
        );
    }
}
