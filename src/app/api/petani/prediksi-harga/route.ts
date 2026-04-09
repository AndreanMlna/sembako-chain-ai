// src/app/api/petani/prediksi-harga/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const komoditas = searchParams.get("komoditas") || "Komoditas Umum";

        // MOCK DATA AI LSTM
        // TODO: Nanti ganti dengan fetch() ke URL API FastAPI/Python AI Anda
        const basePrice = Math.floor(Math.random() * 5000) + 8000; // Harga acak Rp 8.000 - 13.000

        const mockPrediksi = [
            {
                komoditas: komoditas,
                tanggal: new Date(),
                prediksiHargaRp: basePrice,
                trend: "NAIK",
                batasBawahRp: basePrice - 1000,
                batasAtasRp: basePrice + 1500,
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockPrediksi,
            message: `Prediksi AI untuk ${komoditas} berhasil ditarik.`
        });

    } catch (error: unknown) {
        console.error("API Prediksi Harga Error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menghubungi server prediksi harga AI" },
            { status: 500 }
        );
    }
}