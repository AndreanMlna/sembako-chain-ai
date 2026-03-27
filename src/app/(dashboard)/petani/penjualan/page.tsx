"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Store, ShoppingCart, Loader2, Package,
  Zap, Info
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getProdukList } from "@/services/petani.service";
import { toast } from "react-hot-toast";
import { MetodeJual, type Produk } from "@/types";

interface PaginatedResponse {
  data: Produk[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export default function PenjualanPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Logika Aggregation: Menggabungkan produk yang identik
  const aggregatedProducts = useMemo(() => {
    const productMap = new Map<string, Produk>();

    products.forEach((produk) => {
      // Key unik berdasarkan kriteria: Nama, Harga, Kategori, Satuan, dan Metode Jual
      const key = `${produk.nama}-${produk.hargaPerSatuan}-${produk.kategori}-${produk.satuan}-${produk.metodeJual}`;

      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        productMap.set(key, {
          ...existing,
          stokTersedia: existing.stokTersedia + produk.stokTersedia,
        });
      } else {
        productMap.set(key, { ...produk });
      }
    });

    return Array.from(productMap.values());
  }, [products]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProdukList();

      if (response.success && response.data) {
        const productData = Array.isArray(response.data)
            ? response.data
            : (response.data as PaginatedResponse).data || [];

        setProducts(productData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal sinkronisasi etalase");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchProducts();
  }, [mounted, fetchProducts]);

  if (!mounted) return null;

  return (
      <div className="space-y-6 pb-10">
        <PageHeader
            title="Manajemen Penjualan"
            description="Pantau hasil panen Anda yang siap dipasarkan"
        />

        {/* Strategi Penjualan */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="group border-2 border-transparent transition-all hover:border-blue-500/50 hover:shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-500/10 p-4 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Distribusi (B2B)</h3>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    Fokus ke Toko/Pasar terdekat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-2 border-transparent transition-all hover:border-green-500/50 hover:shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-green-500/10 p-4 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Jual Langsung (B2C)</h3>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    Tersedia untuk konsumen umum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-2 border-blue-500/20 bg-blue-500/5 transition-all hover:bg-blue-500/10 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-500 p-4 text-white">
                  <Zap className="h-6 w-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                    Optimasi AI
                  </h3>
                  <p className="mt-1 text-[11px] text-blue-300/80 leading-relaxed">
                    Alokasi stok otomatis ke jalur paling menguntungkan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Produk */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-blue-500" />
              Etalase Produk Aktif
            </h4>
            <Badge variant="default" className="text-[10px] uppercase bg-blue-500/20 text-blue-400 border-none">
              {aggregatedProducts.length} Kelompok Produk
            </Badge>
          </div>

          {isLoading ? (
              <div className="flex h-48 flex-col items-center justify-center space-y-4 rounded-3xl border border-border bg-card/50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-xs italic text-muted-foreground">Menghubungkan ke gudang digital...</p>
              </div>
          ) : aggregatedProducts.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center space-y-3 rounded-3xl border-2 border-dashed border-border bg-card/30">
                <Info className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm italic text-muted-foreground">Belum ada hasil panen di etalase.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {aggregatedProducts.map((produk, idx) => (
                    <Card key={`${produk.id}-${idx}`} className="overflow-hidden border-border/40 bg-card hover:border-blue-500/30 transition-all group shadow-sm">
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] w-full bg-muted/30 flex items-center justify-center relative border-b border-border/50">
                          {produk.fotoUrl ? (
                              <img src={produk.fotoUrl} alt={produk.nama} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Package className="h-10 w-10 text-muted-foreground/20" />
                                <span className="text-[10px] text-muted-foreground/40 font-medium">No Image</span>
                              </div>
                          )}

                          <div className="absolute top-3 right-3">
                            {produk.metodeJual === MetodeJual.FLEKSIBEL ? (
                                <Badge className="bg-blue-600 text-white border-none shadow-lg flex items-center gap-1 text-[9px] px-2 py-0.5">
                                  <Zap className="h-2.5 w-2.5 fill-current" /> AI MANAGED
                                </Badge>
                            ) : (
                                <Badge className="bg-slate-800/90 backdrop-blur-md text-slate-300 border-slate-700 text-[9px] px-2 py-0.5">
                                  {produk.metodeJual}
                                </Badge>
                            )}
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="space-y-1">
                            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{produk.kategori}</p>
                            <h5 className="font-bold truncate text-foreground group-hover:text-blue-400 transition-colors">{produk.nama}</h5>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                            <div>
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Harga / {produk.satuan}</p>
                              <p className="font-bold text-blue-500 text-sm">Rp {produk.hargaPerSatuan.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Total Stok</p>
                              <p className="font-bold text-sm text-foreground">{produk.stokTersedia} <span className="text-[10px] font-normal text-muted-foreground">{produk.satuan}</span></p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}