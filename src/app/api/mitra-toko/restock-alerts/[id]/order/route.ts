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

        const { id } = await params;
        const body = await request.json();
        const { quantity } = body;

        const restockQty = quantity ? Number(quantity) : 0;

        // Find the inventory item
        const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id },
            include: {
                produk: {
                    include: {
                        petani: {
                            select: { id: true, nama: true },
                        },
                    },
                },
            },
        });

        if (!inventoryItem || inventoryItem.tokoId !== toko.id) {
            return NextResponse.json(
                { success: false, message: "Item tidak ditemukan di inventori Anda" },
                { status: 404 }
            );
        }

        const produk = inventoryItem.produk;

        if (!produk.petani) {
            return NextResponse.json(
                { success: false, message: "Produk ini tidak memiliki petani terkait" },
                { status: 400 }
            );
        }

        // Calculate how much to restock (at least up to minStok, or as requested)
        const suggestedQty = Math.max(
            inventoryItem.minStok - inventoryItem.stok,
            restockQty
        );

        if (suggestedQty <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Stok sudah mencukupi, tidak perlu restock",
                },
                { status: 400 }
            );
        }

        // Create an order from the toko to the petani
        const order = await prisma.order.create({
            data: {
                pembeliId: session.user.id,
                metodeJual: "DISTRIBUSI",
                status: "PENDING",
                totalHarga: produk.hargaPerSatuan * suggestedQty,
                ongkosKirim: 0,
                items: {
                    create: {
                        produkId: produk.id,
                        jumlah: suggestedQty,
                        harga: produk.hargaPerSatuan,
                        subtotal: produk.hargaPerSatuan * suggestedQty,
                    },
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                petaniId: produk.petani.id,
                petaniNama: produk.petani.nama,
                produkNama: produk.nama,
                quantity: suggestedQty,
                hargaSatuan: produk.hargaPerSatuan,
                totalHarga: order.totalHarga,
                status: order.status,
            },
            message: `Restock order berhasil dibuat. ${suggestedQty} ${produk.satuan} ${produk.nama} dari ${produk.petani.nama}.`,
        });
    } catch (error: unknown) {
        console.error("POST Restock Order Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal membuat restock order",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
