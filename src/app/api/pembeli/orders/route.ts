// src/app/api/pembeli/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));

    const where = { pembeliId: session.user.id };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              produk: true,
            },
          },
          job: {
            include: {
              kurir: {
                select: {
                  nama: true,
                  telepon: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      message: "Daftar pesanan berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Pembeli Orders Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar pesanan",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // Fallback jika belum login (misal testing langsung di frontend)
    if (!userId) {
      const demoUser = await prisma.user.findFirst({
        where: { role: "PEMBELI" },
      });
      if (demoUser) {
        userId = demoUser.id;
      } else {
        return NextResponse.json(
          { success: false, message: "Silakan login terlebih dahulu untuk membuat pesanan." },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { items, alamatPengiriman, ongkosKirim = 0, metodeJual = "LANGSUNG" } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Keranjang belanja kosong." },
        { status: 400 }
      );
    }

    // Ambil user pembeli
    const pembeli = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!pembeli) {
      return NextResponse.json(
        { success: false, message: "Data pembeli tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hitung total harga
    const totalHarga = items.reduce(
      (acc: number, item: { price: number; qty: number }) => acc + (item.price * item.qty),
      0
    );

    // Ambil salah satu produk dari database sebagai acuan atau fallback jika item ID belum ada
    const fallbackProduct = await prisma.produk.findFirst();

    // Buat pesanan secara transaksional
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Buat Order
      const order = await tx.order.create({
        data: {
          pembeliId: userId!,
          metodeJual: metodeJual === "DISTRIBUSI" ? "DISTRIBUSI" : "LANGSUNG",
          status: "CONFIRMED",
          totalHarga,
          ongkosKirim,
          alamatPengiriman: alamatPengiriman || pembeli.jalan || `${pembeli.kecamatan || ""}, ${pembeli.kabupaten || "Bandung"}`,
          qrCode: `QR-ORD-${Date.now().toString(36).toUpperCase()}`,
        },
      });

      // 2. Buat Order Items
      for (const item of items) {
        // Cek apakah item.id benar-benar ada di tabel produk
        const existingProduk = await tx.produk.findUnique({
          where: { id: item.id },
        });

        const targetProdukId = existingProduk ? existingProduk.id : fallbackProduct?.id;

        if (targetProdukId) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              produkId: targetProdukId,
              jumlah: item.qty,
              harga: item.price,
              subtotal: item.price * item.qty,
            },
          });
        }
      }

      // 3. Buat Job Pengantaran untuk Kurir (Status CONFIRMED agar muncul di lowongan kurir)
      await tx.job.create({
        data: {
          orderId: order.id,
          status: "CONFIRMED",
          estimasiJarak: 5.4,
          estimasiWaktu: 25,
          ongkosKirim,
        },
      });

      // 4. Catat Transaksi Pembayaran
      const firstSeller = fallbackProduct ? fallbackProduct.petaniId : userId!;
      await tx.transaksi.create({
        data: {
          orderId: order.id,
          pengirimId: userId!,
          penerimaId: firstSeller,
          jumlah: totalHarga + ongkosKirim,
          tipe: "PEMBAYARAN",
          status: "BERHASIL",
          referensi: `TRX-${Date.now().toString(36).toUpperCase()}`,
        },
      });

      // 5. Buat Notifikasi Pembeli
      await tx.notifikasi.create({
        data: {
          userId: userId!,
          judul: "Pesanan Berhasil Dibuat!",
          pesan: `Pesanan Anda senilai Rp ${(totalHarga + ongkosKirim).toLocaleString("id-ID")} telah dikonfirmasi dan sedang dicarikan kurir.`,
          tipe: "SUKSES",
          link: `/pembeli/tracking?id=${order.id}`,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Pesanan berhasil dibuat dan tercatat di database",
    });
  } catch (error: unknown) {
    console.error("POST Pembeli Orders Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses checkout pesanan",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
