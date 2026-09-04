// src/app/api/kurir/jobs/available/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const availableJobs = await prisma.job.findMany({
      where: {
        kurirId: null,
        status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
      },
      include: {
        order: {
          include: {
            pembeli: {
              select: {
                id: true,
                nama: true,
                telepon: true,
                jalan: true,
                kecamatan: true,
                kabupaten: true,
              },
            },
            items: {
              include: {
                produk: {
                  select: {
                    nama: true,
                    satuan: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      data: availableJobs,
      message: `Berhasil mengambil ${availableJobs.length} lowongan pengiriman`,
    });
  } catch (error: unknown) {
    console.error("GET Kurir Available Jobs Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar pekerjaan kurir",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
