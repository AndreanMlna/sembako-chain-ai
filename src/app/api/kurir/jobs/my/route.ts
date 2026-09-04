// src/app/api/kurir/jobs/my/route.ts
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

    const myJobs = await prisma.job.findMany({
      where: {
        kurirId: session.user.id,
        status: { in: [OrderStatus.PICKED_UP, OrderStatus.IN_TRANSIT] },
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
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: myJobs,
      message: `Berhasil mengambil ${myJobs.length} tugas aktif kurir`,
    });
  } catch (error: unknown) {
    console.error("GET Kurir My Jobs Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar pekerjaan aktif",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
