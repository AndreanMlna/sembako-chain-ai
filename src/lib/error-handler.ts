// src/lib/error-handler.ts
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export interface StandardApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

/**
 * Helper terstandarisasi untuk menangani error pada API route Next.js.
 * Mencegah kebocoran stack trace database sensitif ke pengguna di lingkungan produksi,
 * sambil memberikan pesan ramah dan kode status HTTP yang akurat.
 */
export function handleApiError(
  error: unknown,
  contextMessage: string = "Terjadi kesalahan pada server"
): NextResponse<StandardApiErrorResponse> {
  const timestamp = new Date().toISOString();

  // 1. Error Validasi Skema Zod
  if (error instanceof ZodError) {
    const errorDetails = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return NextResponse.json(
      {
        success: false,
        message: "Data yang dikirimkan tidak valid",
        code: "VALIDATION_ERROR",
        details: errorDetails,
        timestamp,
      },
      { status: 400 }
    );
  }

  // 2. Error Prisma Database (Known Request Error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed (Data duplikat)
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[])?.join(", ") || "field";
      return NextResponse.json(
        {
          success: false,
          message: `Data sudah terdaftar (${target} duplikat)`,
          code: "DUPLICATE_ENTRY",
          timestamp,
        },
        { status: 409 }
      );
    }

    // P2025: Record to update/delete not found
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang diminta tidak ditemukan di database",
          code: "RECORD_NOT_FOUND",
          timestamp,
        },
        { status: 404 }
      );
    }

    // P2003: Foreign key constraint failed
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "Relasi data tidak valid atau referensi data tidak ditemukan",
          code: "FOREIGN_KEY_VIOLATION",
          timestamp,
        },
        { status: 400 }
      );
    }
  }

  // 3. Error Prisma Client Initialization / Connection Pool
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[Database Connection Pool Error]:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Koneksi ke database sedang mengalami gangguan sementara. Silakan coba lagi.",
        code: "DB_CONNECTION_ERROR",
        timestamp,
      },
      { status: 503 }
    );
  }

  // 4. Standard JavaScript Error
  if (error instanceof Error) {
    console.error(`[API Error in ${contextMessage}]:`, error.message, error.stack);

    return NextResponse.json(
      {
        success: false,
        message: error.message || contextMessage,
        code: "INTERNAL_ERROR",
        timestamp,
      },
      { status: 500 }
    );
  }

  // 5. Unhandled / Unknown Exception
  console.error(`[Unknown Exception in ${contextMessage}]:`, error);
  return NextResponse.json(
    {
      success: false,
      message: contextMessage,
      code: "UNKNOWN_EXCEPTION",
      timestamp,
    },
    { status: 500 }
  );
}
