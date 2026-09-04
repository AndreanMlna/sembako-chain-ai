// src/app/api/pembeli/katalog/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusProduk } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12"));
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    const where: {
      status?: StatusProduk;
      kategori?: string;
      nama?: { contains: string; mode: "insensitive" };
    } = {
      status: StatusProduk.TERSEDIA,
    };

    if (kategori && kategori !== "ALL") {
      where.kategori = kategori;
    }

    if (search) {
      where.nama = { contains: search, mode: "insensitive" };
    }

    const [total, produkList] = await Promise.all([
      prisma.produk.count({ where }),
      prisma.produk.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          petani: {
            select: {
              id: true,
              nama: true,
              kabupaten: true,
              provinsi: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      data: produkList,
      page,
      limit,
      total,
      totalPages,
      message: "Katalog produk berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Katalog Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil katalog produk",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
