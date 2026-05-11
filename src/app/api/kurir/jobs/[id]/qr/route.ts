import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
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
                        pembeli: { select: { id: true, nama: true } },
                        items: {
                            include: {
                                produk: { select: { nama: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!job) {
            return NextResponse.json({ success: false, message: "Job tidak ditemukan" }, { status: 404 });
        }

        if (job.kurirId !== session.user.id) {
            return NextResponse.json({ success: false, message: "Job ini bukan milik Anda" }, { status: 403 });
        }

        // Generate verification token
        const token = `${job.id}:${job.orderId}:${Date.now().toString(36)}`;

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(
            JSON.stringify({ jobId: job.id, orderId: job.orderId, token }),
            { width: 300, margin: 2 }
        );

        return NextResponse.json({
            success: true,
            data: {
                jobId: job.id,
                orderId: job.orderId,
                token,
                qrCode: qrDataUrl,
                pembeli: job.order.pembeli.nama,
                items: job.order.items.map((i) => i.produk.nama).join(", "),
                alamatPengiriman: job.order.alamatPengiriman,
            },
        });
    } catch (error) {
        console.error("QR Generate Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal generate QR code" },
            { status: 500 }
        );
    }
}
