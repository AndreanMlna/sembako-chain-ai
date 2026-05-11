import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (session.user.role !== "MITRA_TOKO") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

        const toko = await prisma.mitraToko.findUnique({ where: { userId: session.user.id } });
        if (!toko) return NextResponse.json({ success: false, message: "Toko tidak ditemukan" }, { status: 404 });

        const [transaksi, orders] = await Promise.all([
            prisma.transaksi.findMany({
                where: { OR: [{ pengirimId: session.user.id }, { penerimaId: session.user.id }] },
                orderBy: { createdAt: "desc" }, take: 30,
            }),
            prisma.order.findMany({
                where: { pembeliId: session.user.id },
                include: { items: { include: { produk: { select: { nama: true } } } } },
                orderBy: { createdAt: "desc" }, take: 20,
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                transaksi: transaksi.map((t) => ({
                    id: t.id, jumlah: t.jumlah, tipe: t.tipe, status: t.status,
                    createdAt: t.createdAt, referensi: t.referensi,
                })),
                orders: orders.map((o) => ({
                    id: o.id, status: o.status, totalHarga: o.totalHarga, createdAt: o.createdAt,
                    items: o.items.map((i) => i.produk.nama).join(", "),
                })),
            },
        });
    } catch (error) {
        console.error("Mitra Toko Riwayat Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil riwayat" }, { status: 500 });
    }
}
