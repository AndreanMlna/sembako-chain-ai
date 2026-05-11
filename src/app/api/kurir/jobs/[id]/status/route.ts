import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const VALID_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PICKED_UP"],
    PICKED_UP: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
};

const ORDER_STATUS_MAP: Record<string, string> = {
    PICKED_UP: "PICKED_UP",
    IN_TRANSIT: "IN_TRANSIT",
    DELIVERED: "DELIVERED",
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
        if (session.user.role !== "KURIR") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Kurir" }, { status: 403 });
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

        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return NextResponse.json(
                { success: false, message: "Job tidak ditemukan" },
                { status: 404 }
            );
        }

        if (job.kurirId !== session.user.id) {
            return NextResponse.json(
                { success: false, message: "Job ini bukan milik Anda" },
                { status: 403 }
            );
        }

        // Validate transition
        const allowed = VALID_TRANSITIONS[job.status];
        if (!allowed || !allowed.includes(newStatus)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Tidak bisa mengubah status dari ${job.status} ke ${newStatus}`,
                },
                { status: 400 }
            );
        }

        const updated = await prisma.job.update({
            where: { id },
            data: { status: newStatus as "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" },
        });

        // Sync order status
        const orderStatus = ORDER_STATUS_MAP[newStatus];
        if (orderStatus) {
            await prisma.order.update({
                where: { id: job.orderId },
                data: { status: orderStatus as "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" },
            });
        }

        // If delivered, unlock produk stock
        if (newStatus === "DELIVERED") {
            const orderItems = await prisma.orderItem.findMany({
                where: { orderId: job.orderId },
            });
            for (const item of orderItems) {
                await prisma.produk.update({
                    where: { id: item.produkId },
                    data: {
                        stokTerkunci: { decrement: item.jumlah },
                        status: "TERSEDIA",
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            data: { jobId: updated.id, status: updated.status },
            message: `Status job berhasil diubah ke ${newStatus}`,
        });
    } catch (error) {
        console.error("Update Job Status Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengupdate status job" },
            { status: 500 }
        );
    }
}
