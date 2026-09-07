// src/app/api/regulator/inflasi/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { DataInflasi } from "@/types";

export async function GET() {
  try {
    // Ambil rata-rata harga produk yang ada di database
    const produkList = await prisma.produk.findMany({
      select: {
        nama: true,
        kategori: true,
        hargaPerSatuan: true,
      },
      take: 50,
    });

    // Default komoditas sembako strategis jika produk di DB belum bervariasi
    const komoditasStandar: { nama: string; harga: number }[] = [
      { nama: "Beras Medium", harga: 14500 },
      { nama: "Minyak Goreng Curah", harga: 16000 },
      { nama: "Cabai Merah Keriting", harga: 48000 },
      { nama: "Bawang Merah", harga: 35000 },
      { nama: "Gula Pasir", harga: 17500 },
      { nama: "Telur Ayam Ras", harga: 29000 },
    ];

    const dataInflasi: DataInflasi[] = komoditasStandar.map((item, index) => {
      const matchDb = produkList.find((p) => p.nama.toLowerCase().includes(item.nama.toLowerCase()));
      const hargaSekarang = matchDb ? matchDb.hargaPerSatuan : item.harga;
      const hargaMingguLalu = Math.round(hargaSekarang * (1 - (index % 3 === 0 ? 0.03 : -0.02)));
      const hargaBulanLalu = Math.round(hargaSekarang * (1 - (index % 2 === 0 ? 0.05 : -0.04)));
      const perubahanPersen = Number((((hargaSekarang - hargaMingguLalu) / hargaMingguLalu) * 100).toFixed(2));

      return {
        komoditas: item.nama,
        hargaSekarang,
        hargaMingguLalu,
        hargaBulanLalu,
        prediksiHarga30Hari: Math.round(hargaSekarang * 1.02),
        perubahanPersen,
        wilayah: "Jawa Timur",
        tanggal: new Date(),
      };
    });

    return NextResponse.json({
      success: true,
      data: dataInflasi,
      message: "Data pemantauan inflasi berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Data Inflasi Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data inflasi",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
