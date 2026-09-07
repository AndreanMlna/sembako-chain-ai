// src/app/api/kurir/jobs/[id]/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function PUT(
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

    const { id: jobId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!jobId || !status) {
      return NextResponse.json(
        { success: false, message: "ID Pekerjaan dan status wajib diisi." },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatuses: Record<string, OrderStatus> = {
      PENDING: OrderStatus.PENDING,
      CONFIRMED: OrderStatus.CONFIRMED,
      PICKED_UP: OrderStatus.PICKED_UP,
      IN_TRANSIT: OrderStatus.IN_TRANSIT,
      DELIVERED: OrderStatus.DELIVERED,
      CANCELLED: OrderStatus.CANCELLED,
    };

    const targetStatus = validStatuses[status.toUpperCase()];
    if (!targetStatus) {
      return NextResponse.json(
        { success: false, message: `Status '${status}' tidak valid.` },
        { status: 400 }
      );
    }

    // Temukan job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        order: {
          include: {
            pembeli: { select: { id: true, nama: true } },
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

    // Pastikan kurir yang mengupdate adalah kurir yang memegang job tersebut
    if (job.kurirId && job.kurirId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Anda tidak berhak mengupdate pekerjaan kurir lain." },
        { status: 403 }
      );
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      // 1. Update status job
      const j = await tx.job.update({
        where: { id: jobId },
        data: { status: targetStatus },
      });

      // 2. Update status order yang berelasi
      await tx.order.update({
        where: { id: job.orderId },
        data: { status: targetStatus },
      });

      // 3. Notifikasi jika dalam perjalanan
      if (targetStatus === OrderStatus.IN_TRANSIT && job.order?.pembeli?.id) {
        await tx.notifikasi.create({
          data: {
            userId: job.order.pembeli.id,
            judul: "Pesanan Sedang Dikirim!",
            pesan: `Kurir sedang dalam perjalanan mengantarkan sembako ke lokasi Anda.`,
            tipe: "INFO",
            link: `/pembeli/tracking?id=${job.orderId}`,
          },
        });
      }

      return j;
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: `Status pekerjaan berhasil diubah menjadi ${targetStatus}`,
    });
  } catch (error: unknown) {
    console.error("PUT Kurir Update Job Status Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui status pekerjaan",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
