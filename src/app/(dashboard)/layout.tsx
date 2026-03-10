"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/auth-store";
import { UserRole } from "@/types";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  // Default to PETANI for development; in production, redirect if no user
  const role = user?.role || UserRole.PETANI;

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
