<<<<<<< HEAD
// src/app/api/petani/lahan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Lahan, Tanaman } from "@prisma/client";

// Memperluas tipe Lahan bawaan Prisma untuk menyertakan relasi tanaman
interface LahanWithRelations extends Lahan {
  tanaman: Tanaman[];
}

// ==========================================
// GET: Mengambil daftar semua lahan milik petani yang sedang login
// ==========================================
export async function GET() {
  try {
=======
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
>>>>>>> 1b2700f (activate role petani)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
          { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
          { status: 401 }
      );
    }

<<<<<<< HEAD
    const dataLahanRaw = await prisma.lahan.findMany({
      where: {
        petaniId: session.user.id,
      },
      include: {
        tanaman: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as LahanWithRelations[]; // Casting ke interface yang sudah didefinisikan

    // Mapping data tanpa menggunakan 'any'
    const dataLahanFormatted = dataLahanRaw.map((lahan) => ({
      id: lahan.id,
      petaniId: lahan.petaniId,
      nama: lahan.nama,
      luasHektar: lahan.luasHektar,
      createdAt: lahan.createdAt,
      updatedAt: lahan.updatedAt,
      lokasi: {
        jalan: lahan.jalan || "",
        kelurahan: lahan.kelurahan || "",
        kecamatan: lahan.kecamatan || "",
        kabupaten: lahan.kabupaten || "",
        provinsi: lahan.provinsi || "",
        kodePos: lahan.kodePos || "",
        latitude: lahan.latitude || 0,
        longitude: lahan.longitude || 0,
      },
      tanaman: lahan.tanaman
    }));

    return NextResponse.json({
      success: true,
      data: dataLahanFormatted,
      message: `Berhasil mengambil ${dataLahanFormatted.length} data lahan`,
    });
  } catch (error: unknown) {
    console.error("GET Lahan Error:", error);
    return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data lahan",
          error: error instanceof Error ? error.message : String(error)
        },
=======
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
>>>>>>> 1b2700f (activate role petani)
        { status: 500 }
    );
  }
}

<<<<<<< HEAD
// ==========================================
// POST: Menambahkan lahan baru dari form UI
// ==========================================
export async function POST(request: NextRequest) {
  try {
=======
export async function POST(request: NextRequest) {
  try {
    // Memastikan user sudah login sebelum melakukan update
>>>>>>> 1b2700f (activate role petani)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
          { success: false, message: "Unauthorized." },
          { status: 401 }
      );
    }

    const body = await request.json();
<<<<<<< HEAD
    const { nama, luasHektar, lokasi } = body;

    const lahanBaru = await prisma.lahan.create({
      data: {
        petaniId: session.user.id,
        nama,
        luasHektar: Number(luasHektar),
        jalan: lokasi?.jalan || "",
        kelurahan: lokasi?.kelurahan || "",
        kecamatan: lokasi?.kecamatan || "",
        kabupaten: lokasi?.kabupaten || "",
        provinsi: lokasi?.provinsi || "",
        kodePos: lokasi?.kodePos || "",
        latitude: lokasi?.latitude ? Number(lokasi.latitude) : 0,
        longitude: lokasi?.longitude ? Number(lokasi.longitude) : 0,
      },
      include: {
        tanaman: true
      }
=======

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
>>>>>>> 1b2700f (activate role petani)
    });

    return NextResponse.json({
      success: true,
<<<<<<< HEAD
      data: lahanBaru,
      message: "Lahan berhasil ditambahkan",
    });
  } catch (error: unknown) {
    console.error("POST Lahan Error:", error);
    return NextResponse.json(
        {
          success: false,
          message: "Gagal menambah lahan",
          error: error instanceof Error ? error.message : String(error)
        },
=======
      data: updatedProfil,
      message: "Profil petani berhasil diperbarui",
    });
  } catch (error) {
    console.error("POST Petani Error:", error);
    return NextResponse.json(
        { success: false, message: "Gagal memperbarui profil", error: String(error) },
>>>>>>> 1b2700f (activate role petani)
        { status: 500 }
    );
  }
}