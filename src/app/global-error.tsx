"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Fatal Global Root Layout Error]:", {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center p-6 bg-neutral-950 text-neutral-100 font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
              Fatal Application Error
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Kesalahan Tingkat Akar Sistem
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Aplikasi mengalami gangguan pada root layout. Silakan klik tombol di bawah untuk menyegarkan sesi.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-neutral-500 bg-neutral-800/80 py-1 px-2 rounded-md">
                Ref ID: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Segarkan Sesi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
