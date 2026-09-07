import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
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


        // Ambil query parameter untuk pagination (default page 1, limit 10)
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Ambil transaksi di mana user adalah PENGIRIM atau PENERIMA
        // Kita gunakan findMany pada model Transaksi langsung agar lebih efisien
        const [transactions, total] = await Promise.all([
            prisma.transaksi.findMany({
                where: {
                    OR: [
                        { pengirimId: session.user.id },
                        { penerimaId: session.user.id }
                    ]
                },
                orderBy: { createdAt: "desc" },
                skip: skip,
                take: limit,
            }),
            prisma.transaksi.count({
                where: {
                    OR: [
                        { pengirimId: session.user.id },
                        { penerimaId: session.user.id }
                    ]
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: transactions,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("API Transaksi Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}