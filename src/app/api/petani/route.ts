import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * API Routes untuk Petani
 *
 * GET /api/petani - Get petani dashboard data
 * POST /api/petani - Create/update petani profile
 */

export async function GET() {
  try {
    // Memastikan user sudah login
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
          { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
          { status: 401 }
      );
    }
    if (session.user.role !== "PETANI") {
        return NextResponse.json(
            { success: false, message: "Forbidden — hanya Petani" },
            { status: 403 }
        );
    }


    // Mengambil profil petani dari database berdasarkan ID session
    const profilPetaniRaw = await prisma.user.findUnique({
      where: {
        id: session.user.id,
        role: "PETANI", // Memastikan user yang mengakses benar-benar memiliki role Petani
      },
      include: {
        wallet: true, // Mengambil relasi e-wallet
        _count: {
          select: { lahan: true }, // Menghitung total lahan yang dimiliki
        },
      },
    });

    if (!profilPetaniRaw) {
      return NextResponse.json(
          { success: false, message: "Profil petani tidak ditemukan." },
          { status: 404 }
      );
    }

    // PERBAIKAN: Mapping data agar sesuai dengan interface 'User' / 'Petani' di Frontend
    const profilPetaniFormatted = {
      id: profilPetaniRaw.id,
      nama: profilPetaniRaw.nama,
      email: profilPetaniRaw.email,
      telepon: profilPetaniRaw.telepon,
      role: profilPetaniRaw.role,
      avatar: profilPetaniRaw.avatar,
      isActive: profilPetaniRaw.isActive,
      createdAt: profilPetaniRaw.createdAt,
      updatedAt: profilPetaniRaw.updatedAt,
      // Mengelompokkan field alamat ke dalam object 'alamat'
      alamat: {
        jalan: profilPetaniRaw.jalan || "",
        kelurahan: profilPetaniRaw.kelurahan || "",
        kecamatan: profilPetaniRaw.kecamatan || "",
        kabupaten: profilPetaniRaw.kabupaten || "",
        provinsi: profilPetaniRaw.provinsi || "",
        kodePos: profilPetaniRaw.kodePos || "",
        latitude: profilPetaniRaw.latitude || 0,
        longitude: profilPetaniRaw.longitude || 0,
      },
      wallet: profilPetaniRaw.wallet,
      _count: profilPetaniRaw._count,
    };

    return NextResponse.json({
      success: true,
      data: profilPetaniFormatted,
      message: "Data profil petani berhasil diambil",
    });
  } catch (error) {
    console.error("GET Petani Error:", error);
    return NextResponse.json(
        { success: false, message: "Gagal mengambil data profil", error: String(error) },
        { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Memastikan user sudah login sebelum melakukan update
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
          { success: false, message: "Unauthorized." },
          { status: 401 }
      );
    }

    const body = await request.json();

    // Destrukturisasi data yang dikirim dari form frontend
    // PERBAIKAN: Menangani kemungkinan frontend mengirim object `alamat` alih-alih field rata
    const {
      nama, telepon, avatar, alamat, // Jika dikirim sebagai object 'alamat'
      jalan, kelurahan, kecamatan, kabupaten, provinsi, kodePos // Jika dikirim langsung
    } = body;

    // Update profil petani di database
    const updatedProfilRaw = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nama,
        telepon,
        avatar,
        // Fleksibilitas: ambil dari object alamat (jika ada) atau fallback ke flat fields
        jalan: alamat?.jalan || jalan,
        kelurahan: alamat?.kelurahan || kelurahan,
        kecamatan: alamat?.kecamatan || kecamatan,
        kabupaten: alamat?.kabupaten || kabupaten,
        provinsi: alamat?.provinsi || provinsi,
        kodePos: alamat?.kodePos || kodePos,
      },
    });

    // PERBAIKAN: Format ulang hasil respons agar Frontend menerima format object `alamat`
    const updatedProfilFormatted = {
      id: updatedProfilRaw.id,
      nama: updatedProfilRaw.nama,
      email: updatedProfilRaw.email,
      telepon: updatedProfilRaw.telepon,
      role: updatedProfilRaw.role,
      avatar: updatedProfilRaw.avatar,
      isActive: updatedProfilRaw.isActive,
      createdAt: updatedProfilRaw.createdAt,
      updatedAt: updatedProfilRaw.updatedAt,
      alamat: {
        jalan: updatedProfilRaw.jalan || "",
        kelurahan: updatedProfilRaw.kelurahan || "",
        kecamatan: updatedProfilRaw.kecamatan || "",
        kabupaten: updatedProfilRaw.kabupaten || "",
        provinsi: updatedProfilRaw.provinsi || "",
        kodePos: updatedProfilRaw.kodePos || "",
        latitude: updatedProfilRaw.latitude || 0,
        longitude: updatedProfilRaw.longitude || 0,
      }
    };

    return NextResponse.json({
      success: true,
      data: updatedProfilFormatted,
      message: "Profil petani berhasil diperbarui",
    });
  } catch (error) {
    console.error("POST Petani Error:", error);
    return NextResponse.json(
        { success: false, message: "Gagal memperbarui profil", error: String(error) },
        { status: 500 }
    );
  }
}