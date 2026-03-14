// Buka src/components/cards/ProdukCard.tsx
// Hapus semua isinya, ganti dengan full kode di bawah ini:

"use client";

import Image from "next/image";
import { MapPin, ShoppingCart, CalendarClock } from "lucide-react"; // Import icon tambahan
import { formatRupiah, cn } from "@/lib/utils"; // Pastikan cn di-import
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Produk } from "@/types"; // Pastikan path import tipe Produk ini benar

// --- DEKLARASI INTERFACE YANG HILANG ---
interface ProdukCardProps {
  produk: Produk;
  onAddToCart?: (produk: Produk) => void;
  onPreOrder?: (produk: Produk) => void;
  showDistance?: boolean;
  distance?: number;
  className?: string; // Menambahkan prop className opsional
}
// ----------------------------------------

export default function ProdukCard({
                                     produk,
                                     onAddToCart,
                                     onPreOrder,
                                     showDistance,
                                     distance,
                                     className,
                                   }: ProdukCardProps) {
  return (
      <div
          className={cn(
              // Struktur dasar dan rounded
              "overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
              // Mode Terang: Background mint pucat, border halus, teks hijau gelap
              "bg-sembako-accent border-sembako-light/20 text-sembako-darkest",
              // Mode Gelap: Background hijau hutan, border sangat halus, teks putih mint
              "dark:bg-sembako-dark dark:border-sembako-light/10 dark:text-sembako-accent",
              className
          )}
      >
        {/* Image Area */}
        <div className="relative aspect-square bg-sembako-primary/5">
          {produk.fotoUrl ? (
              <Image
                  src={produk.fotoUrl}
                  alt={produk.nama}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
          ) : (
              <div className="flex h-full items-center justify-center text-sembako-darkest/40 dark:text-sembako-accent/30 bg-sembako-light/10">
                <span className="text-xs font-medium">Tidak ada foto</span>
              </div>
          )}
          <Badge className="absolute right-2 top-2" variant="success">
            {produk.kategori}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Nama Produk: text-inherit agar ikut warna parent */}
          <h3 className="font-semibold text-inherit truncate">{produk.nama}</h3>

          {/* Harga & Satuan: text-primary agar warnanya hijau utama kamu */}
          <p className="mt-1 text-lg font-bold text-sembako-primary dark:text-sembako-light">
            {formatRupiah(produk.hargaPerSatuan)}
            <span className="text-sm font-normal text-inherit opacity-70"> / {produk.satuan}</span>
          </p>

          {/* Stok: text-inherit opacity untuk penekanan */}
          <p className="mt-1 text-xs font-medium text-inherit opacity-60">
            Stok: {produk.stokTersedia} {produk.satuan}
          </p>

          {showDistance && distance !== undefined && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-inherit opacity-50 border-t border-sembako-light/10 pt-1.5">
                <MapPin className="h-3 w-3" />
                {distance.toFixed(1)} km dari lokasi Anda
              </p>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            {onAddToCart && (
                <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => onAddToCart(produk)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Keranjang
                </Button>
            )}
            {onPreOrder && (
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => onPreOrder(produk)}
                >
                  <CalendarClock className="h-4 w-4" />
                  Pre-Order
                </Button>
            )}
          </div>
        </div>
      </div>
  );
}