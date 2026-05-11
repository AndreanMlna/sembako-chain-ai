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
        if (session.user.role !== "PEMBELI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Pembeli" }, { status: 403 });
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
                        kurir: {
                            select: { id: true, nama: true, telepon: true },
                        },
                    },
                },
                pembeli: {
                    select: { id: true, nama: true },
                },
            },
        });

        if (!order || order.pembeliId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Pesanan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Build tracking timeline
        const trackingSteps = [
            { label: "Pesanan Dibuat", done: true, date: order.createdAt },
            { label: "Dikonfirmasi", done: order.status !== "PENDING", date: null },
            { label: "Dijemput Kurir", done: ["PICKED_UP", "IN_TRANSIT", "DELIVERED"].includes(order.status), date: null },
            { label: "Dalam Pengiriman", done: ["IN_TRANSIT", "DELIVERED"].includes(order.status), date: null },
            { label: "Terkirim", done: order.status === "DELIVERED", date: order.updatedAt },
        ];

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
                tracking: trackingSteps,
                kurir: order.job?.kurir
                    ? { nama: order.job.kurir.nama, telepon: order.job.kurir.telepon }
                    : null,
                estimasiWaktu: order.job?.estimasiWaktu ?? null,
                estimasiJarak: order.job?.estimasiJarak ?? null,
            },
        });
    } catch (error) {
        console.error("GET Order Detail Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil detail pesanan" },
            { status: 500 }
        );
    }
}
