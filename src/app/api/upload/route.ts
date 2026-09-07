import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "File wajib diupload" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ success: false, message: "Format harus JPG, PNG, atau WebP" }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: "Ukuran file maksimal 5MB" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            data: {
                url: `/uploads/${filename}`,
                filename,
                size: file.size,
            },
            message: "File berhasil diupload",
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ success: false, message: "Gagal upload file" }, { status: 500 });
    }
}
