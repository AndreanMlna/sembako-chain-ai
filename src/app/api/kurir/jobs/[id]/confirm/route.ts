// src/app/api/kurir/jobs/[id]/confirm/route.ts
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

    const { id: jobId } = await params;
    let qrCodeInput = "";
    let fotoBukti = "";
    try {
      const body = await req.json();
      qrCodeInput = body.qrCode || "";
      fotoBukti = body.fotoBukti || body.foto || "";
    } catch {
      // Body opsional
    }

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "ID Pekerjaan wajib disertakan." },
        { status: 400 }
      );
    }

    // Ambil detail pekerjaan
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

    if (job.status === OrderStatus.DELIVERED) {
      return NextResponse.json(
        { success: true, message: "Pengiriman ini sudah berstatus selesai sebelumnya." },
        { status: 200 }
      );
    }

    // Transaksi konfirmasi penerimaan
    const result = await prisma.$transaction(async (tx) => {
      // 1. Selesaikan status job
      const completedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          status: OrderStatus.DELIVERED,
          kurirId: session.user.id,
        },
      });

      // 2. Selesaikan status order dan simpan foto bukti / QR bukti
      const proofRecord = fotoBukti
        ? `BUKTI:${fotoBukti}`
        : qrCodeInput
        ? `QR:${qrCodeInput}`
        : job.order.qrCode || "DELIVERED";

      await tx.order.update({
        where: { id: job.orderId },
        data: {
          status: OrderStatus.DELIVERED,
          qrCode: proofRecord,
        },
      });

      // 3. Catat transaksi ongkos kirim ke kurir
      if (job.ongkosKirim > 0) {
        await tx.transaksi.create({
          data: {
            orderId: job.orderId,
            pengirimId: job.order.pembeli.id,
            penerimaId: session.user.id,
            jumlah: job.ongkosKirim,
            tipe: "PEMBAYARAN",
            status: "BERHASIL",
            referensi: `FEE-KURIR-${Date.now().toString(36).toUpperCase()}`,
          },
        });
      }

      // 4. Kirim notifikasi ke pembeli
      if (job.order?.pembeli?.id) {
        await tx.notifikasi.create({
          data: {
            userId: job.order.pembeli.id,
            judul: "Pesanan Telah Tiba!",
            pesan: fotoBukti
              ? `Pesanan Anda telah diserahterimakan dengan selamat oleh kurir disertai foto bukti penerimaan barang.`
              : `Pesanan Anda telah diserahterimakan dengan selamat oleh kurir. Terima kasih!`,
            tipe: "SUKSES",
            link: `/pembeli/tracking?id=${job.orderId}`,
          },
        });
      }

      // 5. Kirim notifikasi ke kurir
      await tx.notifikasi.create({
        data: {
          userId: session.user.id,
          judul: "Pengiriman Selesai!",
          pesan: `Selamat! Anda telah menyelesaikan pengantaran ID: ${job.id.slice(0, 8).toUpperCase()}. Ongkir Rp ${job.ongkosKirim.toLocaleString("id-ID")} berhasil dibukukan.`,
          tipe: "SUKSES",
          link: "/kurir/riwayat",
        },
      });

      return completedJob;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Konfirmasi pengiriman berhasil! Paket telah diserahterimakan.",
    });
  } catch (error: unknown) {
    console.error("POST Kurir Confirm Delivery Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengonfirmasi pengiriman barang",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
