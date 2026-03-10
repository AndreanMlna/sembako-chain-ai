"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types"; // Pastikan ini di-import

export default function DashboardRootLayout({
                                              children,
                                            }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Kita buat variabel penampung role, default-nya PETANI
  let currentRole = UserRole.PETANI;

  // 2. Deteksi otomatis role berdasarkan awalan URL
  if (pathname.startsWith("/kurir")) {
    currentRole = UserRole.KURIR; // Sesuaikan dengan enum/type di file types kamu
  } else if (pathname.startsWith("/mitra-toko")) {
    currentRole = UserRole.MITRA_TOKO;
  } else if (pathname.startsWith("/pembeli")) {
    currentRole = UserRole.PEMBELI;
  } else if (pathname.startsWith("/regulator")) {
    currentRole = UserRole.REGULATOR;
  } else if (pathname.startsWith("/petani")) {
    currentRole = UserRole.PETANI;
  }

  // 3. Kirim role yang sudah didapat dari URL ke DashboardLayout
  return <DashboardLayout role={currentRole}>{children}</DashboardLayout>;
}