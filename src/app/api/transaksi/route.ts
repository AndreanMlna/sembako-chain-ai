import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const tipe = searchParams.get("tipe") || ""; // PEMBAYARAN, PENARIKAN, TOP_UP, REFUND
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {
            OR: [{ pengirimId: session.user.id }, { penerimaId: session.user.id }],
        };

        if (tipe) where.tipe = tipe;

        const [transactions, total] = await Promise.all([
            prisma.transaksi.findMany({
                where,
                include: {
                    pengirim: { select: { id: true, nama: true, role: true } },
                    penerima: { select: { id: true, nama: true, role: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.transaksi.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: transactions.map((t) => ({
                ...t,
                isSender: t.pengirimId === session.user.id,
            })),
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET Transaksi Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data transaksi" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { penerimaId, jumlah, tipe, orderId } = body;

        if (!penerimaId || !jumlah || !tipe) {
            return NextResponse.json(
                { success: false, message: "penerimaId, jumlah, dan tipe wajib diisi" },
                { status: 400 }
            );
        }

        const amount = Number(jumlah);
        if (amount <= 0) {
            return NextResponse.json(
                { success: false, message: "Jumlah harus lebih dari 0" },
                { status: 400 }
            );
        }

        // Validate wallets exist
        const [senderWallet, receiverWallet] = await Promise.all([
            prisma.eWallet.findUnique({ where: { userId: session.user.id } }),
            prisma.eWallet.findUnique({ where: { userId: penerimaId } }),
        ]);

        if (!senderWallet) {
            return NextResponse.json(
                { success: false, message: "Wallet pengirim tidak ditemukan" },
                { status: 400 }
            );
        }

        if (!receiverWallet) {
            return NextResponse.json(
                { success: false, message: "Wallet penerima tidak ditemukan" },
                { status: 400 }
            );
        }

        // Check balance for non-topup transactions
        if (tipe !== "TOP_UP" && senderWallet.saldo < amount) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Saldo tidak mencukupi. Saldo: Rp ${senderWallet.saldo.toLocaleString("id-ID")}`,
                },
                { status: 400 }
            );
        }

        // Process transaction atomically
        const [transaction] = await prisma.$transaction([
            prisma.transaksi.create({
                data: {
                    pengirimId: session.user.id,
                    penerimaId,
                    jumlah: amount,
                    tipe: tipe as "PEMBAYARAN" | "PENARIKAN" | "TOP_UP" | "REFUND",
                    status: "BERHASIL",
                    orderId: orderId || null,
                    referensi: `TRX-${Date.now().toString(36).toUpperCase()}`,
                },
            }),
            // Debit sender
            prisma.eWallet.update({
                where: { userId: session.user.id },
                data: { saldo: { decrement: amount } },
            }),
            // Credit receiver
            prisma.eWallet.update({
                where: { userId: penerimaId },
                data: { saldo: { increment: amount } },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                id: transaction.id,
                jumlah: transaction.jumlah,
                tipe: transaction.tipe,
                status: transaction.status,
                referensi: transaction.referensi,
            },
            message: "Transaksi berhasil",
        });
    } catch (error) {
        console.error("POST Transaksi Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memproses transaksi" },
            { status: 500 }
        );
    }
}
