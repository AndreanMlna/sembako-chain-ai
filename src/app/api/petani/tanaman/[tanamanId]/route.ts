// src/app/api/petani/tanaman/[tanamanId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ tanamanId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { tanamanId } = await context.params;
        const tanaman = await prisma.tanaman.findUnique({
            where: { id: tanamanId },
            include: { lahan: true }
        });

        if (!tanaman) return NextResponse.json({ success: false, message: "Tanaman tidak ditemukan" }, { status: 404 });
        return NextResponse.json({ success: true, data: tanaman });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
    }
}

// 1. KEMBALIKAN KE PATCH: Digunakan oleh halaman Edit Tanaman
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ tanamanId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { tanamanId } = await context.params;
        const body = await request.json();

        const existing = await prisma.tanaman.findUnique({
            where: { id: tanamanId },
            select: { lahan: { select: { petaniId: true } } }
        });

        if (!existing || existing.lahan.petaniId !== session.user.id) {
            return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 403 });
        }

        const updated = await prisma.tanaman.update({
            where: { id: tanamanId },
            data: {
                nama: body.nama || undefined,
                varietasNama: body.varietasNama || undefined,
                tanggalTanam: body.tanggalTanam ? new Date(body.tanggalTanam) : undefined,
                estimasiPanen: body.estimasiPanen ? new Date(body.estimasiPanen) : undefined,
                ...(body.statusPanen && { statusPanen: body.statusPanen }),
                ...(body.statusKesehatan && { statusKesehatan: body.statusKesehatan }),
                jumlahKg: body.jumlahKg !== undefined ? parseFloat(body.jumlahKg) : undefined,
            }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
    }
}

// 2. TAMBAHKAN PUT: Digunakan oleh halaman Manajemen Panen
// Fungsi ini hanya meneruskan (forward) request ke fungsi PATCH di atas
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ tanamanId: string }> }
) {
    return PATCH(request, context);
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ tanamanId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { tanamanId } = await context.params;
        const existing = await prisma.tanaman.findUnique({
            where: { id: tanamanId },
            select: { lahan: { select: { petaniId: true } } }
        });

        if (!existing || existing.lahan.petaniId !== session.user.id) {
            return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 403 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json({ success: false, message: "Forbidden — hanya Petani" }, { status: 403 });
        }


        await prisma.tanaman.delete({ where: { id: tanamanId } });
        return NextResponse.json({ success: true, message: "Terhapus" });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
    }
}