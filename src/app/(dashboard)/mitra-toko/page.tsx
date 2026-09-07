"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, AlertTriangle, CreditCard, ShoppingCart, ArrowUpRight, History, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface TokoDashboardData {
  stats: {
    totalProduk: number;
    stokRendah: number;
    penjualanHariIni: number;
    orderMasuk: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    minStock: number;
    hargaJual: number;
    satuan: string;
  }>;
  recentSales: Array<{
    id: string;
    items: number;
    total: number;
    createdAt: string;
    tipe: string;
  }>;
}

export default function MitraTokoDashboard() {
  const [data, setData] = useState<TokoDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiGet<TokoDashboardData>("/mitra-toko/dashboard");
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard mitra toko:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats || {
    totalProduk: 0,
    stokRendah: 0,
    penjualanHariIni: 0,
    orderMasuk: 0,
  };

  const lowStockProducts = data?.lowStockProducts || [];
  const recentSales = data?.recentSales || [];

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Dashboard Mitra Toko"
        description="Ringkasan inventori dan penjualan toko Anda"
        action={
          <Link href="/mitra-toko/pos">
            <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
              <CreditCard className="mr-2 h-4 w-4" />
              Buka POS
            </Button>
          </Link>
        }
      />

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Produk" value={String(stats.totalProduk)} icon="Package" />
        <StatsCard
          title="Stok Rendah"
          value={String(stats.stokRendah)}
          icon="AlertTriangle"
        />
        <StatsCard
          title="Penjualan Hari Ini"
          value={formatRupiah(stats.penjualanHariIni)}
          icon="CreditCard"
        />
        <StatsCard title="Order Masuk" value={String(stats.orderMasuk)} icon="ShoppingCart" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ALERT RESTOCK */}
        <Card className="border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-foreground">Alert Restock</h3>
              </div>
              <Badge variant={lowStockProducts.length > 0 ? "danger" : "success"}>
                {lowStockProducts.length} Produk
              </Badge>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="text-center py-6 text-sm text-foreground/50">
                Stok seluruh komoditas toko dalam batas aman.
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-foreground/50">Stok: {item.stock} / Min: {item.minStock} {item.satuan}</p>
                    </div>
                    <Link href="/mitra-toko/restock">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-primary/50 text-primary">
                        Restock
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PENJUALAN TERBARU */}
        <Card className="border-primary/10">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Penjualan Terbaru</h3>
              </div>
              <Link href="/mitra-toko/riwayat">
                <Button variant="ghost" size="sm" className="text-xs text-primary">Lihat Semua</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentSales.length === 0 ? (
              <div className="text-center py-6 text-sm text-foreground/50">
                Belum ada transaksi penjualan hari ini.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                        TX
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{sale.id.slice(0, 8)}</p>
                        <p className="text-xs text-foreground/50">
                          {new Date(sale.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} • {sale.tipe}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-foreground">{formatRupiah(sale.total)}</p>
                      <div className="flex items-center justify-end text-[10px] text-primary">
                        <ArrowUpRight className="h-3 w-3" />
                        Sukses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}