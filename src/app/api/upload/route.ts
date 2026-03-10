import { NextRequest, NextResponse } from "next/server";

/**
 * API Route untuk File Upload
 *
 * POST /api/upload - Upload file (images for crop check, product photos, etc.)
 *
 * TODO: Integrate with cloud storage (S3, Cloudinary, etc.)
 */

export async function POST(request: NextRequest) {
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
