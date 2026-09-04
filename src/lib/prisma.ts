// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Ambil URL dari environment
const connectionString = `${process.env.DATABASE_URL}`;

// Inisialisasi pool koneksi database dengan konfigurasi aman serverless
const pool = new Pool({
  connectionString,
  max: process.env.NODE_ENV === "production" ? 10 : 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// PERBAIKAN: Gunakan @ts-expect-error alih-alih 'as any'
// untuk melewati konflik versi @types/pg tanpa memicu error ESLint
// @ts-expect-error: Konflik definisi tipe bawaan antara library pg dan adapter prisma
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter, // INI KUNCINYA! Menggunakan adapter resmi sesuai tuntutan Prisma 7
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;