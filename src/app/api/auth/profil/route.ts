import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import prisma from "@/lib/prisma";

// MATIKAN CACHE 100% DI SISI SERVER
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Tidak ada autentikasi - silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Data pengguna tidak ditemukan di database" },
                { status: 404 }
            );
        }

        console.log("✓ Fetch Profil Database:", user.email, "| Nama DB:", user.nama);

        return NextResponse.json({
            id: user.id,
            nama: user.nama ?? "",
            email: user.email ?? "",
            telepon: user.telepon ?? "",
            role: user.role ?? "",
            avatar: user.avatar ?? "",
            jalan: user.jalan ?? "",
            kelurahan: user.kelurahan ?? "",
            kecamatan: user.kecamatan ?? "",
            kabupaten: user.kabupaten ?? "",
            provinsi: user.provinsi ?? "",
            kodePos: user.kodePos ?? "",
            latitude: user.latitude,
            longitude: user.longitude,
        });
    } catch (error) {
        console.error("❌ Error saat fetch profil:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server saat mengambil data profil" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Tidak ada autentikasi - silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        const body = await req.json();

        // TANGKAP SEMUA KEMUNGKINAN NAMA VARIABEL
        const inputNama = body.nama || body.name || "";
        const inputEmail = body.email || "";
        const inputTelepon = body.telepon || body.phone || "";

        if (!inputNama.trim() || !inputEmail.trim()) {
            return NextResponse.json(
                { error: "Nama dan email tidak boleh kosong" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                nama: inputNama.trim(),
                email: inputEmail.trim(),
                telepon: inputTelepon.trim(),
                jalan: body.jalan?.trim() || "",
                kelurahan: body.kelurahan?.trim() || "",
                kecamatan: body.kecamatan?.trim() || "",
                kabupaten: body.kabupaten?.trim() || "",
                provinsi: body.provinsi?.trim() || "",
                kodePos: body.kodePos?.trim() || "",
            },
        });

        console.log("✓ Database Updated:", updatedUser.email, "| Nama:", updatedUser.nama);

        return NextResponse.json({
            success: true,
            message: "Profil berhasil diperbarui",
            user: updatedUser
        });
    } catch (error) {
        console.error("❌ Error update profil:", error);
        return NextResponse.json(
            { error: "Gagal memperbarui database" },
            { status: 500 }
        );
    }
}