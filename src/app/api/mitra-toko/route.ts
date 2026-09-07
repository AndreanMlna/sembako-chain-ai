import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "MITRA_TOKO") {
        return NextResponse.json({ success: false, message: "Forbidden — hanya Mitra Toko" }, { status: 403 });
    }

    return NextResponse.json({
        success: true,
        data: { message: "Mitra Toko API endpoint" },
    });
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "MITRA_TOKO") {
        return NextResponse.json({ success: false, message: "Forbidden — hanya Mitra Toko" }, { status: 403 });
    }

    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
}
