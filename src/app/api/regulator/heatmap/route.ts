// src/app/api/regulator/heatmap/route.ts
import { NextResponse } from "next/server";
import type { HeatmapData } from "@/types";

export async function GET() {
  try {
    const heatmapData: HeatmapData[] = [
      {
        wilayah: "Surabaya",
        latitude: -7.2575,
        longitude: 112.7521,
        stokLevel: 85,
        rataRataHarga: 15200,
        jumlahTransaksi: 1240,
      },
      {
        wilayah: "Malang",
        latitude: -7.9666,
        longitude: 112.6326,
        stokLevel: 92,
        rataRataHarga: 14800,
        jumlahTransaksi: 820,
      },
      {
        wilayah: "Kediri",
        latitude: -7.848,
        longitude: 112.0178,
        stokLevel: 78,
        rataRataHarga: 14300,
        jumlahTransaksi: 530,
      },
      {
        wilayah: "Jember",
        latitude: -8.1724,
        longitude: 113.7007,
        stokLevel: 64,
        rataRataHarga: 15600,
        jumlahTransaksi: 410,
      },
      {
        wilayah: "Banyuwangi",
        latitude: -8.2192,
        longitude: 114.3691,
        stokLevel: 58,
        rataRataHarga: 16100,
        jumlahTransaksi: 360,
      },
    ];

    return NextResponse.json({
      success: true,
      data: heatmapData,
      message: "Data heatmap distribusi stok pangan berhasil diambil",
    });
  } catch (error: unknown) {
    console.error("GET Heatmap Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data heatmap",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
