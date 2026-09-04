// src/lib/next-auth.ts
// Re-export dari @/lib/auth agar konfigurasi autentikasi terpusat dan konsisten di seluruh aplikasi
export { authOptions } from "./auth";
export type { SessionUser } from "./auth";