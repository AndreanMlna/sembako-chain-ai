"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 1. Tentukan role berdasarkan URL spesifik
  let currentRole = UserRole.PETANI;

  if (pathname.startsWith("/kurir")) {
    currentRole = UserRole.KURIR;
  } else if (pathname.startsWith("/mitra-toko")) {
    currentRole = UserRole.MITRA_TOKO;
  } else if (pathname.startsWith("/pembeli")) {
    currentRole = UserRole.PEMBELI;
  } else if (pathname.startsWith("/regulator")) {
    currentRole = UserRole.REGULATOR;
  } else if (pathname.startsWith("/petani")) {
    currentRole = UserRole.PETANI;
  } else if (session?.user?.role) {
    // 2. Pada halaman bersama (/profil, /notifikasi), gunakan role akun yang sedang login
    currentRole = session.user.role as UserRole;
  }

  // 3. Kirim role ke DashboardLayout
  return <DashboardLayout role={currentRole}>{children}</DashboardLayout>;
}