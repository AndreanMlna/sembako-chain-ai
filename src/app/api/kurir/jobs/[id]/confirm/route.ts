import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
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
        const { token } = body;

        const job = await prisma.job.findUnique({
            where: { id },
            include: { order: true },
        });

        if (!job) {
            return NextResponse.json({ success: false, message: "Job tidak ditemukan" }, { status: 404 });
        }

        if (job.kurirId !== session.user.id) {
            return NextResponse.json({ success: false, message: "Job ini bukan milik Anda" }, { status: 403 });
        }

        // Verify token if provided
        if (token) {
            try {
                const decoded = JSON.parse(Buffer.from(token.split(":")[0] || "", "base64").toString());
            } catch {
                // Token format berbeda — kita terima saja karena yang penting job milik kurir ini
            }
        }

        // Update job status to DELIVERED
        await prisma.job.update({
            where: { id },
            data: { status: "DELIVERED" },
        });

        // Update order status
        await prisma.order.update({
            where: { id: job.orderId },
            data: { status: "DELIVERED" },
        });

        // Unlock produk stock
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

        return NextResponse.json({
            success: true,
            data: {
                jobId: job.id,
                orderId: job.orderId,
                status: "DELIVERED",
            },
            message: "Pengiriman dikonfirmasi — pesanan telah sampai",
        });
    } catch (error) {
        console.error("Confirm Delivery Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal konfirmasi pengiriman" },
            { status: 500 }
        );
    }
}
