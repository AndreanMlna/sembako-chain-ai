// src/app/api/pembeli/pre-order/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function estimatePrice(nama: string): number {
  const lower = nama.toLowerCase();
  if (lower.includes("cabai") || lower.includes("cabe")) return 35000;
  if (lower.includes("bawang")) return 28000;
  if (lower.includes("beras") || lower.includes("padi")) return 13500;
  if (lower.includes("tomat")) return 12000;
  if (lower.includes("kentang")) return 16000;
  if (lower.includes("jagung")) return 8500;
  if (lower.includes("kedelai")) return 11000;
  return 20000;
}

export async function GET() {
  try {
    const crops = await prisma.tanaman.findMany({
      where: {
        statusPanen: {
          not: "DIPANEN",
        },
      },
      include: {
        lahan: {
          include: {
            petani: true,
          },
        },
      },
      orderBy: {
        estimasiPanen: "asc",
      },
      take: 20,
    });

    const preOrders = crops.map((crop, idx) => {
      let statusText = "Fase Generatif";
      let variant: "default" | "success" | "warning" | "danger" | "info" = "info";

      if (crop.statusPanen === "SIAP_PANEN") {
        statusText = "Siap Panen";
        variant = "success";
      } else if (crop.statusPanen === "TANAM") {
        statusText = "Fase Vegetatif";
        variant = "warning";
      }

      const totalSlots = crop.jumlahKg ? Math.round(crop.jumlahKg) : 500;
      const slots = Math.min(
        crop.jumlahKg ? Math.round(crop.jumlahKg * 0.35) : 150,
        totalSlots
      );

      const formattedHarvest = new Date(crop.estimasiPanen).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const sellerName = crop.lahan?.petani?.nama
        ? `Kelompok Tani ${crop.lahan.petani.nama}`
        : crop.lahan?.nama || "Petani Mitra";

      return {
        id: `PO-${String(idx + 1).padStart(3, "0")}`,
        name: crop.varietasNama ? `${crop.nama} (${crop.varietasNama})` : crop.nama,
        seller: sellerName,
        harvestDate: formattedHarvest,
        price: estimatePrice(crop.nama),
        unit: "kg",
        slots,
        totalSlots,
        status: statusText,
        variant,
      };
    });

    return NextResponse.json({
      success: true,
      data: preOrders,
    });
  } catch (error) {
    console.error("GET Pre-order error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat jadwal pre-order", error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
