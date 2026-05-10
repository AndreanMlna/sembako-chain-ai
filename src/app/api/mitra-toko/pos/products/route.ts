import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        const items = await prisma.inventoryItem.findMany({
            where: { tokoId: toko.id },
            include: {
                produk: {
                    select: {
                        id: true,
                        nama: true,
                        kategori: true,
                        satuan: true,
                        fotoUrl: true,
                    },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        // Format untuk POS: hanya items dengan stok > 0
        const available = items
            .filter((item) => item.stok > 0)
            .map((item) => ({
                id: item.id,
                produkId: item.produkId,
                nama: item.produk.nama,
                kategori: item.produk.kategori,
                satuan: item.produk.satuan,
                fotoUrl: item.produk.fotoUrl,
                stok: item.stok,
                hargaJual: item.hargaJual,
            }));

        // Filter by search if provided
        const filtered = search
            ? available.filter(
                  (p) =>
                      p.nama.toLowerCase().includes(search.toLowerCase()) ||
                      p.kategori.toLowerCase().includes(search.toLowerCase())
              )
            : available;

        return NextResponse.json({
            success: true,
            data: filtered,
        });
    } catch (error: unknown) {
        console.error("GET POS Products Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil data produk",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
