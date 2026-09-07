import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (session.user.role !== "PETANI") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const [orders, transaksi] = await Promise.all([
            prisma.order.findMany({
                where: { items: { some: { produk: { petaniId: session.user.id } } } },
                include: {
                    items: { include: { produk: { select: { nama: true } } } },
                    pembeli: { select: { nama: true } },
                },
                orderBy: { createdAt: "desc" }, take: 20,
            }),
            prisma.transaksi.findMany({
                where: { OR: [{ pengirimId: session.user.id }, { penerimaId: session.user.id }] },
                orderBy: { createdAt: "desc" }, take: 20,
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                penjualan: orders.map((o) => ({
                    id: o.id, status: o.status, totalHarga: o.totalHarga, createdAt: o.createdAt,
                    pembeli: o.pembeli.nama,
                    items: o.items.map((i) => i.produk.nama).join(", "),
                })),
                transaksi: transaksi.map((t) => ({
                    id: t.id, jumlah: t.jumlah, tipe: t.tipe, status: t.status, createdAt: t.createdAt,
                    referensi: t.referensi,
                })),
            },
        });
    } catch (error) {
        console.error("Petani Riwayat Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil riwayat" }, { status: 500 });
    }
}
