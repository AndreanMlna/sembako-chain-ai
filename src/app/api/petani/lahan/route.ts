import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Sesuaikan jika export auth config Anda berbeda
import prisma from "@/lib/prisma";

/**
 * API Routes untuk Petani
 *
 * GET /api/petani - Get petani dashboard data
 * POST /api/petani - Create/update petani profile
 *
 * Sub-routes:
 * /api/petani/lahan - CRUD lahan
 * /api/petani/tanaman - CRUD tanaman
 * /api/petani/crop-check - AI crop check
 * /api/petani/produk - CRUD produk penjualan
 * /api/petani/wallet - E-wallet operations
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

    // Mengambil profil petani dari database berdasarkan ID session
    const profilPetani = await prisma.user.findUnique({
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

    if (!profilPetani) {
      return NextResponse.json(
          { success: false, message: "Profil petani tidak ditemukan." },
          { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profilPetani,
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
    const {
      nama, telepon, avatar,
      jalan, kelurahan, kecamatan, kabupaten, provinsi, kodePos
    } = body;

    // Update profil petani di database
    const updatedProfil = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nama,
        telepon,
        avatar,
        jalan,
        kelurahan,
        kecamatan,
        kabupaten,
        provinsi,
        kodePos,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProfil,
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