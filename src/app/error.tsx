"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error secara terstruktur untuk analitik dan debugging pengembang
    console.error("[App Error Boundary Caught Exception]:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl shadow-primary/5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
            Terjadi Kesalahan Sistem
          </span>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Gagal Memuat Halaman
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Terjadi gangguan sementara saat memproses data. Silakan coba muat ulang atau kembali ke halaman utama.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground/60 bg-muted py-1 px-2 rounded-md">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-all"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
