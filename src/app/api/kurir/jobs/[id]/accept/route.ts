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

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        items: {
                            include: {
                                produk: { select: { id: true, nama: true } },
                            },
                        },
                        pembeli: { select: { id: true, nama: true } },
                    },
                },
            },
        });

        if (!job) {
            return NextResponse.json(
                { success: false, message: "Job tidak ditemukan" },
                { status: 404 }
            );
        }

        if (job.kurirId) {
            return NextResponse.json(
                { success: false, message: "Job ini sudah diambil kurir lain" },
                { status: 409 }
            );
        }

        // Assign kurir and update status
        const updated = await prisma.job.update({
            where: { id },
            data: {
                kurirId: session.user.id,
                status: "PICKED_UP",
            },
        });

        // Also update the order status
        await prisma.order.update({
            where: { id: job.orderId },
            data: { status: "PICKED_UP" },
        });

        return NextResponse.json({
            success: true,
            data: {
                jobId: updated.id,
                status: "PICKED_UP",
                orderId: job.orderId,
                pembeli: job.order.pembeli.nama,
                items: job.order.items.map((i) => i.produk.nama).join(", "),
            },
            message: "Job berhasil diambil",
        });
    } catch (error) {
        console.error("Accept Job Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil job" },
            { status: 500 }
        );
    }
}
