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

        if (session.user.role !== "MITRA_TOKO") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Mitra Toko" },
                { status: 403 }
            );
        }

        // Cari mitra toko berdasarkan userId
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
        const kategori = searchParams.get("kategori") || "";

        const where: Record<string, unknown> = { tokoId: toko.id };

        const inventory = await prisma.inventoryItem.findMany({
            where,
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
            orderBy: { updatedAt: "desc" },
        });

        // Filter by search & kategori on the joined produk data
        let filtered = inventory;
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.produk.nama.toLowerCase().includes(q) ||
                    item.produk.kategori.toLowerCase().includes(q)
            );
        }
        if (kategori) {
            filtered = filtered.filter((item) => item.produk.kategori === kategori);
        }

        return NextResponse.json({
            success: true,
            data: filtered,
            message: `Berhasil mengambil ${filtered.length} item inventori`,
        });
    } catch (error: unknown) {
        console.error("GET Inventory Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil data inventori",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "MITRA_TOKO") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Mitra Toko" },
                { status: 403 }
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
        const { produkId, stok, minStok, hargaJual } = body;

        if (!produkId || stok == null || hargaJual == null) {
            return NextResponse.json(
                { success: false, message: "produkId, stok, dan hargaJual wajib diisi" },
                { status: 400 }
            );
        }

        // Cek duplikat
        const existing = await prisma.inventoryItem.findFirst({
            where: { tokoId: toko.id, produkId },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "Produk sudah ada di inventori. Gunakan update untuk mengubah." },
                { status: 409 }
            );
        }

        const item = await prisma.inventoryItem.create({
            data: {
                tokoId: toko.id,
                produkId,
                stok: Number(stok),
                minStok: minStok != null ? Number(minStok) : 10,
                hargaJual: Number(hargaJual),
            },
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
            data: item,
            message: "Item berhasil ditambahkan ke inventori",
        });
    } catch (error: unknown) {
        console.error("POST Inventory Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Gagal menambah item inventori",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
