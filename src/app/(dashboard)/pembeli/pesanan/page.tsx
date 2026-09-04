"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Truck, CheckCircle2, Clock, Search, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface OrderItemUI {
  id: string;
  rawId: string;
  date: string;
  store: string;
  items: string;
  total: number;
  status: string;
  color: BadgeVariant;
}

interface RawOrderResponse {
  id: string;
  status: string;
  totalHarga: number;
  ongkosKirim: number;
  createdAt: string;
  items: Array<{
    id: string;
    jumlah: number;
    produk: {
      nama: string;
      satuan: string;
    };
  }>;
  job?: {
    kurir?: {
      nama: string;
    };
  };
}

export default function PesananPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<RawOrderResponse[]>("/pembeli/orders");
      if (res.success && Array.isArray(res.data)) {
        const formatted: OrderItemUI[] = res.data.map((o) => {
          let statusText = "Diproses";
          let badgeColor: BadgeVariant = "info";

          if (o.status === "DELIVERED" || o.status === "SELESAI") {
            statusText = "Selesai";
            badgeColor = "success";
          } else if (o.status === "IN_TRANSIT" || o.status === "PICKED_UP") {
            statusText = "Dikirim";
            badgeColor = "warning";
          } else if (o.status === "CANCELLED" || o.status === "DIBATALKAN") {
            statusText = "Dibatalkan";
            badgeColor = "danger";
          }

          const itemsText =
            o.items.length > 0
              ? o.items.map((i) => `${i.jumlah} ${i.produk?.satuan || "kg"} ${i.produk?.nama || "Item"}`).join(", ")
              : "Sembako Pangan";

          const createdDate = new Date(o.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return {
            id: `ORD-${o.id.slice(-4).toUpperCase()}`,
            rawId: o.id,
            date: createdDate,
            store: o.job?.kurir?.nama ? `Kurir: ${o.job.kurir.nama}` : "Sentra Logistik Sembako",
            items: itemsText,
            total: o.totalHarga + (o.ongkosKirim || 0),
            status: statusText,
            color: badgeColor,
          };
        });
        setOrders(formatted);
      }
    } catch (err) {
      console.error("Gagal mengambil pesanan pembeli:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "Semua") return true;
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Selesai": return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case "Dikirim": return <Truck className="h-5 w-5 text-yellow-500" />;
      case "Diproses": return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Package className="h-5 w-5 text-foreground/40" />;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Pesanan Saya"
        description="Pantau status pengiriman dan riwayat belanja Anda"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-foreground/50">Memuat riwayat pesanan dari database...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {["Semua", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((tab) => (
              <Badge
                key={tab}
                variant="default"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "cursor-pointer px-4 py-1.5 text-[11px] font-bold border-none transition-all active:scale-95",
                  activeTab === tab
                    ? "bg-primary text-white shadow-sm"
                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                )}
              >
                {tab}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  onClick={() => router.push(`/pembeli/tracking?id=${order.rawId}`)}
                  className="group border-border bg-card hover:border-primary/50 transition-all overflow-hidden shadow-sm cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                      <div className="flex items-center gap-4 md:w-1/4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest leading-none mb-1">
                            {order.id}
                          </p>
                          <Badge variant={order.color} className="text-[9px] h-4 font-black uppercase">
                            {order.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider leading-none">
                          {order.store}
                        </p>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {order.items}
                        </h4>
                        <p className="text-[10px] text-foreground/40 font-medium">
                          Dipesan pada {order.date}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center md:w-1/4 gap-2 border-t border-border pt-4 md:border-none md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Total Bayar</p>
                          <p className="text-lg font-black text-primary tracking-tighter">
                            Rp {order.total.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/pembeli/tracking?id=${order.rawId}`);
                          }}
                          className="h-8 text-[10px] font-black border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all"
                        >
                          DETAIL
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/40">
                <p className="text-sm font-medium text-foreground/40">
                  Tidak ada pesanan dengan status "{activeTab}".
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon="Package"
          title="Belum ada pesanan"
          description="Pesanan Anda akan muncul di sini setelah melakukan pembelian dari Katalog Produk."
          actionLabel="Mulai Belanja"
          onAction={() => router.push("/pembeli/katalog")}
        />
      )}

            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3 items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <ShoppingBag className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                    Punya kendala dengan pesanan? <span className="text-primary font-bold cursor-pointer hover:underline">Tanya AI Assistant</span> kami untuk bantuan instan 24/7.
                </p>
            </div>
        </div>
    );
}