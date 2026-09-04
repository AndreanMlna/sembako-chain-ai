// src/app/api/kurir/jobs/[id]/accept/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const kurirId = session.user.id;
    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "ID Pekerjaan tidak valid." },
        { status: 400 }
      );
    }

    // Cari job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        order: {
          include: {
            pembeli: {
              select: { id: true, nama: true },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Pekerjaan pengantaran tidak ditemukan." },
        { status: 404 }
      );
    }

    if (job.kurirId && job.kurirId !== kurirId) {
      return NextResponse.json(
        { success: false, message: "Pekerjaan ini sudah diambil oleh kurir lain." },
        { status: 409 }
      );
    }

    // Update job dan order secara transaksional
    const updatedJob = await prisma.$transaction(async (tx) => {
      // 1. Assign kurir & set status PICKED_UP
      const updated = await tx.job.update({
        where: { id: jobId },
        data: {
          kurirId,
          status: OrderStatus.PICKED_UP,
        },
        include: {
          order: true,
        },
      });

      // 2. Update status order menjadi PICKED_UP
      await tx.order.update({
        where: { id: job.orderId },
        data: {
          status: OrderStatus.PICKED_UP,
        },
      });

      // 3. Beri notifikasi ke pembeli
      if (job.order?.pembeli?.id) {
        await tx.notifikasi.create({
          data: {
            userId: job.order.pembeli.id,
            judul: "Pesanan Diambil Kurir!",
            pesan: `Kurir telah mengambil pesanan Anda dan sedang mempersiapkan pengantaran.`,
            tipe: "INFO",
            link: `/pembeli/tracking?id=${job.orderId}`,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: "Job berhasil diambil! Silakan cek menu Route Optimizer untuk navigasi pengantaran.",
    });
  } catch (error: unknown) {
    console.error("POST Kurir Accept Job Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil pekerjaan kurir",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
