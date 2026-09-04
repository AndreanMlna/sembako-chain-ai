// src/app/api/mitra-toko/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inventorySchema } from "@/lib/validators";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const toko = await prisma.mitraToko.findUnique({
      where: { userId: session.user.id },
    });

    if (!toko) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Profil toko belum dibuat",
      });
    }

    const inventory = await prisma.inventoryItem.findMany({
      where: { tokoId: toko.id },
      include: {
        produk: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: inventory,
      message: `Berhasil mengambil ${inventory.length} item inventori`,
    });
  } catch (error: unknown) {
    console.error("GET Inventory Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil inventori toko",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    let toko = await prisma.mitraToko.findUnique({
      where: { userId: session.user.id },
    });

    // Buat profil toko default jika belum ada
    if (!toko) {
      toko = await prisma.mitraToko.create({
        data: {
          userId: session.user.id,
          namaToko: `Toko ${session.user.nama || "Mitra"}`,
          jenisToko: "Kelontong / Sembako",
        },
      });
    }

    const rawBody = await request.json();
    const validation = inventorySchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data inventori tidak valid",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { produkId, stok, minStok, hargaJual } = validation.data;

    const itemBaru = await prisma.inventoryItem.create({
      data: {
        tokoId: toko.id,
        produkId,
        stok: Math.floor(stok),
        minStok: Math.floor(minStok),
        hargaJual: Number(hargaJual),
      },
      include: {
        produk: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: itemBaru,
      message: "Item inventori berhasil ditambahkan",
    });
  } catch (error: unknown) {
    console.error("POST Inventory Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan item inventori",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
