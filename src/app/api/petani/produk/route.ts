// src/app/api/petani/produk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Mengambil daftar produk khusus milik petani yang sedang login
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Petani" },
                { status: 403 }
            );
        }


        const products = await prisma.produk.findMany({
            where: { petaniId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error("GET Produk Petani Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil data produk petani" }, { status: 500 });
    }
}

// POST: Digunakan untuk auto-listing ke etalase
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.nama || !body.hargaPerSatuan || !body.stokTersedia) {
            return NextResponse.json({ success: false, message: "Data produk wajib tidak lengkap" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        // Fallback koordinat jika tidak dikirim di body atau tidak ada di profil user
        const lat = body.latitude || user?.latitude || -6.200000;
        const lng = body.longitude || user?.longitude || 106.816666;

        const produkBaru = await prisma.produk.create({
            data: {
                nama: body.nama,
                kategori: body.kategori || "Hasil Panen",
                deskripsi: body.deskripsi || "Produk segar langsung dari kebun.",
                satuan: body.satuan || "kg",
                fotoUrl: body.fotoUrl || "",
                // Memastikan input adalah number sebelum masuk ke Prisma
                hargaPerSatuan: Number(body.hargaPerSatuan),
                stokTersedia: Number(body.stokTersedia),
                latitude: Number(lat),
                longitude: Number(lng),
                metodeJual: body.metodeJual || "LANGSUNG",
                petaniId: session.user.id,
            },
        });

        return NextResponse.json({
            success: true,
            data: produkBaru,
            message: "Produk berhasil ditambahkan ke etalase",
        });

    } catch (error) {
        console.error("POST Produk Petani Error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat menyimpan produk" },
            { status: 500 }
        );
    }
}