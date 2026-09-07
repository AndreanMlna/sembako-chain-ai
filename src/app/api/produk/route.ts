import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, MetodeJual as PrismaMetodeJual } from "@prisma/client"; // Import enum resmi dari Prisma
import { produkSchema } from "@/lib/validators";

/**
 * GET /api/produk - Get products (with filtering, sorting, pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "freshness";

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ProdukWhereInput = {};

    if (kategori && kategori !== "ALL") {
      whereCondition.kategori = kategori;
    }

    if (search) {
      whereCondition.nama = {
        contains: search,
        mode: "insensitive"
      };
    }

    let orderByCondition: Prisma.ProdukOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") orderByCondition = { hargaPerSatuan: "asc" };
    if (sortBy === "price_desc") orderByCondition = { hargaPerSatuan: "desc" };

    const [totalItems, products] = await Promise.all([
      prisma.produk.count({ where: whereCondition }),
      prisma.produk.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: orderByCondition,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });

  } catch (error) {
    console.error("GET Produk Error:", error);
    return NextResponse.json(
        { success: false, message: "Gagal mengambil data katalog produk" },
        { status: 500 }
    );
  }
}

/**
 * POST /api/produk - Create new product
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Cek Sesi User
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "PETANI") {
      return NextResponse.json({ success: false, message: "Forbidden — hanya Petani" }, { status: 403 });
    }

    // 2. Ambil Body & Validasi menggunakan Zod
    const body = await request.json();

    // Validasi input menggunakan schema yang sudah dibuat
    const validation = produkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Data produk tidak valid",
        errors: validation.error.format()
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // 3. Ambil data user untuk koordinat lokasi (Latitude & Longitude)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { latitude: true, longitude: true }
    });

    const lat = body.latitude || user?.latitude || -6.200000;
    const lng = body.longitude || user?.longitude || 106.816666;

    // 4. Simpan ke Database
    const produkBaru = await prisma.produk.create({
      data: {
        nama: validatedData.nama,
        kategori: validatedData.kategori,
        deskripsi: validatedData.deskripsi || "Produk segar langsung dari kebun.",
        satuan: validatedData.satuan,
        fotoUrl: body.fotoUrl || "",
        hargaPerSatuan: validatedData.hargaPerSatuan,
        stokTersedia: validatedData.stokTersedia,
        latitude: parseFloat(lat.toString()),
        longitude: parseFloat(lng.toString()),
        // SOLUSI TS2322: Casting explicit ke enum Prisma agar sinkron
        metodeJual: validatedData.metodeJual as PrismaMetodeJual,
        petaniId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: produkBaru,
      message: "Produk berhasil ditambahkan ke etalase",
    });

  } catch (error) {
    console.error("POST Produk Error:", error);
    return NextResponse.json(
        { success: false, message: "Terjadi kesalahan saat menyimpan produk" },
        { status: 500 }
    );
  }
}