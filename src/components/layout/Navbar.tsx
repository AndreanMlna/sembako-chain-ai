"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, User, Menu, X, AlertCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { APP_NAME } from "@/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // LOGIKA LOGOUT TOTAL KE PORT 3001
  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();

    // Kita pakai window.location.origin supaya dia dinamis
    // ngikutin port yang lagi jalan (3001)
    const callbackUrl = typeof window !== "undefined" ? window.location.origin : "/";

    await signOut({
      callbackUrl: callbackUrl,
      redirect: true
    });
  };

  return (
      <header className="sticky top-0 z-[100] w-full bg-nav shadow-md transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-accent md:hidden hover:bg-white/5 active:scale-95 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-accent tracking-tighter">{APP_NAME}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                  href="/notifikasi"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-accent/70 hover:bg-white/5 hover:text-accent transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Link>

              <Link
                  href="/profil"
                  className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      pathname === "/profil"
                          ? "bg-accent/10 text-accent"
                          : "text-accent/70 hover:bg-white/5 hover:text-accent"
                  )}
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
              </Link>

              {/* Logout Button Desktop */}
              <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-red-400/10 transition-colors active:scale-95"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* User Icon Mobile Shortcut */}
            <Link
                href="/profil"
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all md:hidden",
                    pathname === "/profil" ? "bg-accent text-sembako-darkest" : "bg-accent/10 text-accent"
                )}
                onClick={closeMenu}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div
            className={cn(
                "fixed left-0 right-0 top-16 z-[101] border-b border-white/5 bg-nav p-4 shadow-2xl transition-all duration-300 md:hidden",
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}
        >
          <nav className="flex flex-col gap-2">
            <Link
                href="/profil"
                onClick={closeMenu}
                className={cn(
                    "flex items-center gap-4 rounded-xl p-4 transition-all",
                    pathname === "/profil" ? "bg-accent/20 text-accent" : "bg-white/5 text-accent/80"
                )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-lg">W</div>
              <div className="flex-1 text-accent">
                <p className="text-sm font-bold">Wafa Bila Syaefurokhman</p>
                <p className="text-xs opacity-50">Lihat & Edit Profil</p>
              </div>
              <User className="h-5 w-5 opacity-40 text-accent" />
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                  href="/notifikasi"
                  onClick={closeMenu}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 p-4 text-accent/80 hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <span className="text-sm font-medium">Notifikasi</span>
              </Link>

              {/* Logout Button Mobile */}
              <button
                  onClick={() => {
                    closeMenu();
                    setShowLogoutModal(true);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-500/10 p-4 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </nav>
        </div>

        {/* MODAL KONFIRMASI LOGOUT */}
        <Modal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            title="Konfirmasi Keluar"
        >
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-foreground">Yakin ingin keluar?</p>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Sesi login Anda akan dihapus. Anda harus masuk kembali untuk mengakses data Sembako-Chain.
              </p>
            </div>
            <div className="flex w-full gap-3 pt-2">
              <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </Button>
              <Button
                  variant="danger"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                  onClick={handleLogout}
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Overlay Background */}
        {isOpen && (
            <div
                className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm md:hidden"
                onClick={closeMenu}
            />
        )}
      </header>
  );
}