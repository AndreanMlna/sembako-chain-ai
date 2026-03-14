"use client";

import { Package, AlertTriangle, CreditCard, ShoppingCart, ArrowUpRight, History } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function MitraTokoDashboard() {
  // Dummy data untuk Alert Restock
  const lowStockProducts = [
    { id: 1, name: "Beras Rojolele 5kg", stock: 3, minStock: 10 },
    { id: 2, name: "Minyak Goreng 2L", stock: 5, minStock: 15 },
    { id: 3, name: "Gula Pasir 1kg", stock: 8, minStock: 20 },
  ];

  // Dummy data untuk Penjualan Terbaru
  const recentSales = [
    { id: "TRX-001", items: 3, total: "Rp 125.000", time: "10 menit lalu" },
    { id: "TRX-002", items: 1, total: "Rp 45.000", time: "25 menit lalu" },
    { id: "TRX-003", items: 5, total: "Rp 312.000", time: "1 jam lalu" },
  ];

  return (
      <div className="space-y-6 animate-in">
        <PageHeader
            title="Dashboard Mitra Toko"
            description="Ringkasan inventori dan penjualan toko Anda"
            action={
              <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                <CreditCard className="mr-2 h-4 w-4" />
                Buka POS
              </Button>
            }
        />

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Produk" value="45" icon="Package" />
          <StatsCard
              title="Stok Rendah"
              value="8"
              icon="AlertTriangle"
              trend={{ value: -12, isPositive: false }}
          />
          <StatsCard
              title="Penjualan Hari Ini"
              value="Rp 1.250.000"
              icon="CreditCard"
              trend={{ value: 5, isPositive: true }}
          />
          <StatsCard title="Order Masuk" value="12" icon="ShoppingCart" />
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
                <Badge variant="danger">{lowStockProducts.length} Produk</Badge>
              </div>

              <div className="space-y-4">
                {lowStockProducts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-foreground/50">Stok: {item.stock} / Min: {item.minStock}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs border-primary/50 text-primary">
                        Restock
                      </Button>
                    </div>
                ))}
              </div>
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
                <Button variant="ghost" size="sm" className="text-xs text-primary">Lihat Semua</Button>
              </div>

              <div className="divide-y divide-border">
                {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                          TX
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{sale.id}</p>
                          <p className="text-xs text-foreground/50">{sale.items} Item • {sale.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-foreground">{sale.total}</p>
                        <div className="flex items-center justify-end text-[10px] text-primary">
                          <ArrowUpRight className="h-3 w-3" />
                          Success
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}