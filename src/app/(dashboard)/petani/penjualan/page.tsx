"use client";

import { Plus, Store, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function PenjualanPage() {
  return (
    <div>
      <PageHeader
        title="Penjualan"
        description="Pilih metode penjualan hasil panen Anda"
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        }
      />

      {/* Metode Jual Selection */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="cursor-pointer border-2 transition-colors hover:border-green-500">
          <CardContent className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <Store className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Distribusi (B2B)
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Kirim stok ke Toko/Pasar mitra. AI akan mencocokkan stok
                dengan kebutuhan toko terdekat.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer border-2 transition-colors hover:border-green-500">
          <CardContent className="flex items-start gap-4">
            <div className="rounded-lg bg-green-50 p-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Jual Langsung (B2C)
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Jual langsung ke konsumen/UMKM melalui aplikasi.
                Kurir lokal akan menjemput di lahan Anda.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Product listing and management */}
    </div>
  );
}
