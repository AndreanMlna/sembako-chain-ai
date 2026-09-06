import Link from "next/link";
import { AlertCircle, ArrowLeft, Home, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan | Sembako-Chain AI",
  description: "Halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke beranda atau katalog.",
  robots: {
    index: false,
    follow: true, // Biarkan crawler tetap mengikuti link internal kembali ke halaman utama
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-2">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman atau tautan yang Anda tuju mungkin sudah dipindahkan, dihapus, atau alamat URL yang dimasukkan salah.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/pembeli/katalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Jelajahi Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}
