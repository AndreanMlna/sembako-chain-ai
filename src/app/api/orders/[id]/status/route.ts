import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
};

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status: newStatus } = body;

        if (!newStatus) {
            return NextResponse.json(
                { success: false, message: "Status baru wajib diisi" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({ where: { id } });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order tidak ditemukan" }, { status: 404 });
        }

        // Only pembeli or system can update
        const isOwner = order.pembeliId === session.user.id;
        if (!isOwner) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Validate transition
        const allowed = ALLOWED_TRANSITIONS[order.status];
        if (!allowed || !allowed.includes(newStatus)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Tidak bisa mengubah status dari ${order.status} ke ${newStatus}`,
                },
                { status: 400 }
            );
        }

        // If cancelling, restore stock
        if (newStatus === "CANCELLED") {
            const orderItems = await prisma.orderItem.findMany({
                where: { orderId: id },
            });
            for (const item of orderItems) {
                await prisma.produk.update({
                    where: { id: item.produkId },
                    data: {
                        stokTersedia: { increment: item.jumlah },
                        stokTerkunci: { decrement: item.jumlah },
                        status: "TERSEDIA",
                    },
                });
            }
        }

        await prisma.order.update({
            where: { id },
            data: { status: newStatus as "CONFIRMED" | "CANCELLED" },
        });

        return NextResponse.json({
            success: true,
            data: { orderId: id, status: newStatus },
            message: `Status order berhasil diubah ke ${newStatus}`,
        });
    } catch (error) {
        console.error("PATCH Order Status Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengupdate status order" },
            { status: 500 }
        );
    }
}
