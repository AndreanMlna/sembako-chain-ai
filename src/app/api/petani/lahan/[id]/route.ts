import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// --- FUNGSI GET ---
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Petani" },
                { status: 403 }
            );
        }


        // Penting: Await params untuk Next.js 15/16
        const { id } = await params;

        const dataLahanRaw = await prisma.lahan.findFirst({
            where: { id, petaniId: session.user.id },
            include: { tanaman: { orderBy: { createdAt: 'desc' } } },
        });

        if (!dataLahanRaw) {
            return NextResponse.json({ success: false, message: "Data lahan tidak ditemukan." }, { status: 404 });
        }

        const dataLahanFormatted = {
            id: dataLahanRaw.id,
            petaniId: dataLahanRaw.petaniId,
            nama: dataLahanRaw.nama,
            luasHektar: dataLahanRaw.luasHektar,
            createdAt: dataLahanRaw.createdAt,
            updatedAt: dataLahanRaw.updatedAt,
            lokasi: {
                jalan: dataLahanRaw.jalan || "",
                kelurahan: dataLahanRaw.kelurahan || "",
                kecamatan: dataLahanRaw.kecamatan || "",
                kabupaten: dataLahanRaw.kabupaten || "",
                provinsi: dataLahanRaw.provinsi || "",
                kodePos: dataLahanRaw.kodePos || "",
                latitude: dataLahanRaw.latitude || 0,
                longitude: dataLahanRaw.longitude || 0,
            },
            tanaman: dataLahanRaw.tanaman,
        };

        return NextResponse.json({
            success: true,
            data: dataLahanFormatted,
        });

    } catch (error: unknown) {
        console.error("GET Lahan API Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil detail lahan" },
            { status: 500 }
        );
    }
}

// --- FITUR UPDATE (PATCH) ---
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { nama, luasHektar, lokasi } = body;

        // Validasi keberadaan lahan
        const existingLahan = await prisma.lahan.findFirst({
            where: { id, petaniId: session.user.id }
        });

        if (!existingLahan) {
            return NextResponse.json({ success: false, message: "Lahan tidak ditemukan." }, { status: 404 });
        }

        const updatedLahan = await prisma.lahan.update({
            where: { id },
            data: {
                nama: nama ?? undefined,
                luasHektar: luasHektar ? Number(luasHektar) : undefined,
                jalan: lokasi?.jalan ?? undefined,
                kelurahan: lokasi?.kelurahan ?? undefined,
                kecamatan: lokasi?.kecamatan ?? undefined,
                kabupaten: lokasi?.kabupaten ?? undefined,
                provinsi: lokasi?.provinsi ?? undefined,
                kodePos: lokasi?.kodePos ?? undefined,
                latitude: lokasi?.latitude ?? undefined,
                longitude: lokasi?.longitude ?? undefined,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedLahan,
            message: "Data lahan berhasil diperbarui",
        });

    } catch (error: unknown) {
        console.error("PATCH Lahan API Error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "Gagal memperbarui data" },
            { status: 500 }
        );
    }
}

// PUT disesuaikan agar menerima params dengan benar
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return PATCH(request, { params });
}

// --- FUNGSI DELETE (BARU DITAMBAHKAN) ---
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
        }

        const { id } = await params;

        // Validasi keberadaan lahan & kepemilikan
        const existingLahan = await prisma.lahan.findFirst({
            where: { id, petaniId: session.user.id }
        });

        if (!existingLahan) {
            return NextResponse.json({ success: false, message: "Lahan tidak ditemukan atau akses ditolak." }, { status: 404 });
        }

        // Eksekusi Hapus Lahan
        await prisma.lahan.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Lahan berhasil dihapus",
        });

    } catch (error: unknown) {
        console.error("DELETE Lahan API Error:", error);

        // Menangani error jika lahan masih memiliki tanaman (Prisma Foreign Key Constraint)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Foreign key constraint failed")) {
            return NextResponse.json(
                { success: false, message: "Gagal menghapus! Lahan ini masih memiliki data tanaman. Hapus tanaman terlebih dahulu." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Gagal menghapus data lahan" },
            { status: 500 }
        );
    }
}