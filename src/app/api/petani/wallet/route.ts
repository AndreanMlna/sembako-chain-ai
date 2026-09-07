import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== "PETANI") {
            return NextResponse.json(
                { success: false, message: "Forbidden — hanya Petani" },
                { status: 403 }
            );
        }


        // Ambil data User yang mencakup Wallet DAN Transaksi
        const userData = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                wallet: true, // Mengambil saldo
                // Kita ambil transaksi di mana user adalah pengirim ATAU penerima
                transaksiKirim: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                transaksiTerima: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }
            }
        });

        if (!userData || !userData.wallet) {
            return NextResponse.json({ success: false, error: "Data keuangan tidak ditemukan" }, { status: 404 });
        }

        // Gabungkan transaksi kirim & terima lalu urutkan berdasarkan tanggal terbaru
        const riwayatGabungan = [...userData.transaksiKirim, ...userData.transaksiTerima]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 10);

        return NextResponse.json({
            success: true,
            data: {
                ...userData.wallet,
                riwayatTransaksi: riwayatGabungan // Kita bungkus agar sesuai dengan interface EWallet di frontend
            }
        });
    } catch (error) {
        console.error("API Wallet Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}