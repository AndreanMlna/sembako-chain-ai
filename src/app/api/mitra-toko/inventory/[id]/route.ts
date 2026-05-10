import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
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
        const { stok, minStok, hargaJual, produkId } = body;

        // Verify this item belongs to the user's toko
        const existing = await prisma.inventoryItem.findUnique({
            where: { id },
        });

        if (!existing || existing.tokoId !== toko.id) {
            return NextResponse.json(
                { success: false, message: "Item tidak ditemukan" },
                { status: 404 }
            );
        }

        const data: Record<string, unknown> = {};
        if (stok !== undefined) data.stok = Number(stok);
        if (minStok !== undefined) data.minStok = Number(minStok);
        if (hargaJual !== undefined) data.hargaJual = Number(hargaJual);
        if (produkId !== undefined) data.produkId = produkId;

        const updated = await prisma.inventoryItem.update({
            where: { id },
            data,
            include: {
                produk: {
                    select: {
                        id: true,
                        nama: true,
                        kategori: true,
                        satuan: true,
                        fotoUrl: true,
                        hargaPerSatuan: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: updated,
            message: "Item inventori berhasil diperbarui",
        });
    } catch (error: unknown) {
        console.error("PATCH Inventory Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal memperbarui item inventori",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
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
        const existing = await prisma.inventoryItem.findUnique({
            where: { id },
        });

        if (!existing || existing.tokoId !== toko.id) {
            return NextResponse.json(
                { success: false, message: "Item tidak ditemukan" },
                { status: 404 }
            );
        }

        await prisma.inventoryItem.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: "Item inventori berhasil dihapus",
        });
    } catch (error: unknown) {
        console.error("DELETE Inventory Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal menghapus item inventori",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
