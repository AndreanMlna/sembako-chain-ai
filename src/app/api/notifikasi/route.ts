import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const notifs = await prisma.notifikasi.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ success: true, data: notifs });
    } catch (error) {
        console.error("GET Notifikasi Error:", error);
        return NextResponse.json({ success: false, message: "Gagal mengambil notifikasi" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, readAll } = body;

        if (readAll) {
            await prisma.notifikasi.updateMany({
                where: { userId: session.user.id, dibaca: false },
                data: { dibaca: true },
            });
            return NextResponse.json({ success: true, message: "Semua notifikasi ditandai dibaca" });
        }

        if (id) {
            await prisma.notifikasi.update({
                where: { id },
                data: { dibaca: true },
            });
            return NextResponse.json({ success: true, message: "Notifikasi ditandai dibaca" });
        }

        return NextResponse.json({ success: false, message: "ID atau readAll diperlukan" }, { status: 400 });
    } catch (error) {
        console.error("PATCH Notifikasi Error:", error);
        return NextResponse.json({ success: false, message: "Gagal update notifikasi" }, { status: 500 });
    }
}
