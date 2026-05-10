import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * API Route untuk File Upload
 *
 * POST /api/upload - Upload file (images for crop check, product photos, etc.)
 *
 * TODO: Integrate with cloud storage (S3, Cloudinary, etc.)
 */

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }


  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  // TODO: Process and upload file to cloud storage
  return NextResponse.json({
    success: true,
    data: {
      message: "File upload endpoint - implement with cloud storage",
      fileName: file instanceof File ? file.name : "unknown",
    },
  });
}
