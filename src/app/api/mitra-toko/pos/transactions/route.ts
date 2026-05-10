import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const toko = await prisma.mitraToko.findUnique({
            where: { userId: session.user.id },
        });

        if (!toko) {
            return NextResponse.json(
                { success: false, message: "Profil toko tidak ditemukan" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { items } = body as {
            items: { inventoryItemId: string; quantity: number }[];
        };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "Minimal 1 item harus dipilih" },
                { status: 400 }
            );
        }

        let totalAmount = 0;
        const receiptItems: {
            nama: string;
            quantity: number;
            hargaSatuan: number;
            subtotal: number;
        }[] = [];

        // Process each item: validate stock, update inventory, calculate total
        for (const cartItem of items) {
            const inventoryItem = await prisma.inventoryItem.findUnique({
                where: { id: cartItem.inventoryItemId },
                include: { produk: { select: { nama: true, satuan: true } } },
            });

            if (!inventoryItem || inventoryItem.tokoId !== toko.id) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Item dengan ID ${cartItem.inventoryItemId} tidak ditemukan di inventori Anda`,
                    },
                    { status: 404 }
                );
            }

            if (inventoryItem.stok < cartItem.quantity) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Stok ${inventoryItem.produk.nama} tidak mencukupi. Tersedia: ${inventoryItem.stok}`,
                    },
                    { status: 400 }
                );
            }

            // Decrease stock
            await prisma.inventoryItem.update({
                where: { id: cartItem.inventoryItemId },
                data: { stok: { decrement: cartItem.quantity } },
            });

            const subtotal = inventoryItem.hargaJual * cartItem.quantity;
            totalAmount += subtotal;

            receiptItems.push({
                nama: inventoryItem.produk.nama,
                quantity: cartItem.quantity,
                hargaSatuan: inventoryItem.hargaJual,
                subtotal,
            });
        }

        // Create transaction record
        const transaksi = await prisma.transaksi.create({
            data: {
                pengirimId: session.user.id,
                penerimaId: session.user.id,
                jumlah: totalAmount,
                tipe: "PEMBAYARAN",
                status: "BERHASIL",
                referensi: `POS-${Date.now().toString(36).toUpperCase()}`,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                transaksiId: transaksi.id,
                referensi: transaksi.referensi,
                items: receiptItems,
                total: totalAmount,
                waktu: transaksi.createdAt,
            },
            message: "Transaksi berhasil",
        });
    } catch (error: unknown) {
        console.error("POST POS Transaction Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal memproses transaksi",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
