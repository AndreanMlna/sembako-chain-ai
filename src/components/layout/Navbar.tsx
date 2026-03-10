"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/constants";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Bersihkan semua data sesi di penyimpanan lokal browser (localStorage & sessionStorage)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // 2. Bersihkan token yang mungkin tersimpan di cookie browser
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 3. (Opsional) Panggil API endpoint untuk menghapus sesi server / HTTP-only cookie
      // Sengaja kita tambahkan .catch() agar aplikasi tidak error jika endpoint ini belum Anda buat
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    } finally {
      // 4. Setelah semua bersih, paksa kembali ke homepage dan refresh state aplikasi
      router.push("/");
      router.refresh();
    }
  };

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-700">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-4 md:flex">
            <button className="relative rounded-full p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">Profil</span>
            </button>

            {/* Tombol Keluar Desktop */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg p-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Keluar</span>
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
              className="rounded-lg p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
            ) : (
                <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="border-t bg-white p-4 md:hidden">
              <nav className="flex flex-col gap-2">
                <Link
                    href="/notifikasi"
                    className="flex items-center gap-2 rounded-lg p-3 hover:bg-gray-100"
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifikasi</span>
                </Link>
                <Link
                    href="/profil"
                    className="flex items-center gap-2 rounded-lg p-3 hover:bg-gray-100"
                >
                  <User className="h-5 w-5" />
                  <span>Profil</span>
                </Link>

                {/* Tombol Keluar Mobile */}
                <button
                    onClick={handleLogout}
                    className="flex w-full text-left items-center gap-2 rounded-lg p-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
        )}
      </header>
  );
}