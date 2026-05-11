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
        if (session.user.role !== "PEMBELI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Pembeli" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { pembeliId: session.user.id },
                include: {
                    items: {
                        include: {
                            produk: {
                                select: { id: true, nama: true, satuan: true, fotoUrl: true },
                            },
                        },
                    },
                    job: {
                        select: { id: true, status: true, estimasiWaktu: true, estimasiJarak: true },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.order.count({ where: { pembeliId: session.user.id } }),
        ]);

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET Orders Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data pesanan" },
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
        if (session.user.role !== "PEMBELI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Pembeli" }, { status: 403 });
        }

        const body = await request.json();
        const { items, alamatPengiriman } = body as {
            items: { produkId: string; quantity: number }[];
            alamatPengiriman?: string;
        };

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "Minimal 1 item harus dipilih" },
                { status: 400 }
            );
        }

        // Get user location
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { latitude: true, longitude: true, jalan: true, kelurahan: true, kecamatan: true, kabupaten: true },
        });

        let totalHarga = 0;
        const orderItems: { produkId: string; jumlah: number; harga: number; subtotal: number }[] = [];

        // Validate each item and check stock
        for (const cartItem of items) {
            const produk = await prisma.produk.findUnique({
                where: { id: cartItem.produkId },
            });

            if (!produk) {
                return NextResponse.json(
                    { success: false, message: `Produk dengan ID ${cartItem.produkId} tidak ditemukan` },
                    { status: 404 }
                );
            }

            if (produk.stokTersedia < cartItem.quantity) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Stok ${produk.nama} tidak mencukupi. Tersedia: ${produk.stokTersedia}`,
                    },
                    { status: 400 }
                );
            }

            const subtotal = produk.hargaPerSatuan * cartItem.quantity;
            totalHarga += subtotal;

            orderItems.push({
                produkId: produk.id,
                jumlah: cartItem.quantity,
                harga: produk.hargaPerSatuan,
                subtotal,
            });

            // Lock stock: kurangi stokTersedia, tambah stokTerkunci
            await prisma.produk.update({
                where: { id: produk.id },
                data: {
                    stokTersedia: { decrement: cartItem.quantity },
                    stokTerkunci: { increment: cartItem.quantity },
                    status: "TERPESAN",
                },
            });
        }

        // Build alamat from user profile
        const alamat = alamatPengiriman || [
            user?.jalan, user?.kelurahan, user?.kecamatan, user?.kabupaten
        ].filter(Boolean).join(", ") || "Alamat tidak tersedia";

        // Create the order
        const order = await prisma.order.create({
            data: {
                pembeliId: session.user.id,
                metodeJual: "LANGSUNG",
                status: "PENDING",
                totalHarga,
                ongkosKirim: 0,
                alamatPengiriman: alamat,
                latitude: user?.latitude ?? undefined,
                longitude: user?.longitude ?? undefined,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        produk: { select: { id: true, nama: true, satuan: true } },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                totalHarga: order.totalHarga,
                status: order.status,
                items: order.items.map((i) => ({
                    nama: i.produk.nama,
                    jumlah: i.jumlah,
                    harga: i.harga,
                    subtotal: i.subtotal,
                })),
                createdAt: order.createdAt,
            },
            message: "Pesanan berhasil dibuat",
        });
    } catch (error) {
        console.error("POST Order Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal membuat pesanan" },
            { status: 500 }
        );
    }
}
