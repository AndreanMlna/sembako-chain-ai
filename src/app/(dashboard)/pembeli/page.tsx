"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Truck, Wallet, CalendarClock, MapPin, Star, ArrowRight, PackageCheck, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

interface PembeliDashboardData {
  stats: {
    activeOrders: number;
    inShipping: number;
    totalSpent: number;
    preOrders: number;
  };
  recentOrders: Array<{
    id: string;
    item: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
  nearbyProducts: Array<{
    id: string;
    name: string;
    seller: string;
    price: number;
    satuan: string;
    location: string;
    stock: number;
  }>;
}

export default function PembeliDashboard() {
  const [data, setData] = useState<PembeliDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickBuy = (product: PembeliDashboardData["nearbyProducts"][0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.satuan,
      qty: 1,
    });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await apiGet<PembeliDashboardData>("/pembeli/dashboard");
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard pembeli:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats || {
    activeOrders: 0,
    inShipping: 0,
    totalSpent: 0,
    preOrders: 0,
  };

  const nearbyProducts = data?.nearbyProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Dashboard Pembeli"
        description="Temukan bahan pangan segar langsung dari sumbernya"
        action={
          <Link href="/pembeli/katalog">
            <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Belanja Sekarang
            </Button>
          </Link>
        }
      />

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pesanan Aktif" value={String(stats.activeOrders)} icon="ShoppingCart" />
        <StatsCard title="Dalam Pengiriman" value={String(stats.inShipping)} icon="Truck" />
        <StatsCard title="Total Belanja" value={formatRupiah(stats.totalSpent)} icon="Wallet" />
        <StatsCard title="Pre-Order" value={String(stats.preOrders)} icon="CalendarClock" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PRODUK TERDEKAT / TERSEDIA */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Produk Segar Tersedia</h3>
              </div>
              <Link href="/pembeli/katalog">
                <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Lihat Semua</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : nearbyProducts.length === 0 ? (
              <div className="text-center py-8 text-sm text-foreground/50">
                Belum ada produk pangan yang terdaftar di etalase.
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyProducts.map((product) => (
                  <div key={product.id} className="group flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary/[0.02] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PackageCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{product.name}</p>
                        <p className="text-[10px] text-foreground/50 font-medium">{product.seller} • {product.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-[10px] font-bold text-foreground/60">Stok: {product.stock} {product.satuan}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{formatRupiah(product.price)}/{product.satuan}</p>
                      <button
                        onClick={() => handleQuickBuy(product)}
                        className="inline-block mt-1 text-[10px] font-bold text-primary hover:underline transition-colors active:scale-95"
                      >
                        + Beli Cepat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PESANAN TERBARU */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Pesanan Terbaru</h3>
              </div>
              <Link href="/pembeli/pesanan">
                <Button variant="ghost" size="sm" className="text-xs text-foreground/40">Riwayat</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-sm text-foreground/50">
                Anda belum memiliki riwayat pesanan.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const isInDelivery = order.status === "IN_TRANSIT" || order.status === "PICKED_UP";
                  return (
                    <Link
                      key={order.id}
                      href={`/pembeli/tracking?id=${order.id}`}
                      className="flex items-center justify-between py-4 group cursor-pointer hover:bg-primary/[0.03] -mx-2 px-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black shadow-inner transition-transform group-hover:scale-105",
                          isInDelivery ? "bg-yellow-500/10 text-yellow-600" : "bg-primary/10 text-primary"
                        )}>
                          {isInDelivery ? "TR" : "OK"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground/30 uppercase tracking-tighter">{order.id.slice(0, 10)}</p>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{order.item}</p>
                          <Badge variant={isInDelivery ? "warning" : "success"} className="text-[9px] h-4 mt-1">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-foreground">{formatRupiah(order.total)}</p>
                        <ArrowRight className="h-4 w-4 ml-auto mt-1 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}