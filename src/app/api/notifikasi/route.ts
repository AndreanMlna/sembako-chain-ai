// src/app/api/notifikasi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari yang lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Jika belum login, ambil notifikasi sistem umum / demo
    const userId = session?.user?.id;

    const notifs = await prisma.notifikasi.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const data = notifs.map((n) => {
      let type = "info";
      if (n.tipe === "SUKSES") type = "success";
      else if (n.tipe === "PERINGATAN") type = "warning";
      else if (n.tipe === "ERROR") type = "danger";

      return {
        id: n.id,
        title: n.judul,
        description: n.pesan,
        time: formatRelativeTime(new Date(n.createdAt)),
        type,
        isRead: n.dibaca,
        link: n.link,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET Notifikasi Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat notifikasi", error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const { id, all } = body;

    if (all) {
      if (session?.user?.id) {
        await prisma.notifikasi.updateMany({
          where: { userId: session.user.id },
          data: { dibaca: true },
        });
      } else {
        await prisma.notifikasi.updateMany({
          data: { dibaca: true },
        });
      }
      return NextResponse.json({ success: true, message: "Semua notifikasi ditandai dibaca" });
    }

    if (id) {
      await prisma.notifikasi.update({
        where: { id },
        data: { dibaca: true },
      });
      return NextResponse.json({ success: true, message: "Notifikasi ditandai dibaca" });
    }

    return NextResponse.json({ success: false, message: "Parameter tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("PATCH Notifikasi Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui status notifikasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID notifikasi diperlukan" }, { status: 400 });
    }

    await prisma.notifikasi.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Notifikasi Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus notifikasi" },
      { status: 500 }
    );
  }
}
