"use client";

import { Plus, Store, ShoppingCart, ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function PenjualanPage() {
  return (
      <div className="space-y-6">
        <PageHeader
            title="Penjualan"
            description="Pilih metode penjualan hasil panen Anda"
            action={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Produk
              </Button>
            }
        />

        {/* Metode Jual Selection */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Metode B2B */}
          <Card className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Store className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">
                      Distribusi (B2B)
                    </h3>
                    <ArrowRight className="h-5 w-5 text-foreground/20 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    Kirim stok ke Toko/Pasar mitra. <span className="font-semibold text-primary">AI Matching</span> akan mencocokkan stok dengan kebutuhan toko terdekat secara otomatis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metode B2C */}
          <Card className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">
                      Jual Langsung (B2C)
                    </h3>
                    <ArrowRight className="h-5 w-5 text-foreground/20 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    Jual langsung ke konsumen atau UMKM. Kurir Sembako-Chain akan menjemput hasil panen langsung di lokasi lahan Anda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Listing Produk Placeholder */}
        <div className="mt-12">
          <h4 className="mb-4 text-lg font-bold text-foreground">Produk Aktif Anda</h4>
          <Card className="border-dashed">
            <CardContent className="flex h-40 flex-col items-center justify-center space-y-2">
              <p className="text-sm text-foreground/40 italic">Belum ada produk yang didaftarkan.</p>
              <Button variant="outline" size="sm">Mulai Jual Sekarang</Button>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}