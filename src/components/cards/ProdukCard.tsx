"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Produk } from "@/types";

interface ProdukCardProps {
  produk: Produk;
  onAddToCart?: (produk: Produk) => void;
  onPreOrder?: (produk: Produk) => void;
  showDistance?: boolean;
  distance?: number;
}

export default function ProdukCard({
  produk,
  onAddToCart,
  onPreOrder,
  showDistance,
  distance,
}: ProdukCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {produk.fotoUrl ? (
          <Image
            src={produk.fotoUrl}
            alt={produk.nama}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Tidak ada foto
          </div>
        )}
        <Badge className="absolute right-2 top-2" variant="success">
          {produk.kategori}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{produk.nama}</h3>
        <p className="mt-1 text-lg font-bold text-green-700">
          {formatRupiah(produk.hargaPerSatuan)}/{produk.satuan}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Stok: {produk.stokTersedia} {produk.satuan}
        </p>
        {showDistance && distance !== undefined && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            {distance.toFixed(1)} km dari lokasi Anda
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          {onAddToCart && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onAddToCart(produk)}
            >
              + Keranjang
            </Button>
          )}
          {onPreOrder && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onPreOrder(produk)}
            >
              Pre-Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
