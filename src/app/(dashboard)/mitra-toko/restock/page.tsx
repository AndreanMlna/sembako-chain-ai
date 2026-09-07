"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, MapPin, Wheat, ArrowRight, AlertCircle } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { apiGet } from "@/lib/api";

interface RestockAlert {
  id: string | number;
  product: string;
  currentStock: number;
  minStock: number;
  priority: string;
  recommendation: {
    farmer: string;
    distance: string;
    stockAvailable: number;
    price: string;
  };
}

export default function RestockPage() {
  const [alerts, setAlerts] = useState<RestockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<RestockAlert[]>("/mitra-toko/restock");
      if (res.success && Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat alert restock:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestock();
  }, [fetchRestock]);


    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Auto-Restock"
                description="Notifikasi otomatis stok rendah dan rekomendasi suplai dari petani terdekat"
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-bold border-primary/20 text-primary"
                        onClick={fetchRestock}
                        disabled={loading}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </Button>
                }
            />

            {alerts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className="border-l-4 border-l-red-500 overflow-hidden bg-card">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Bagian Kiri: Info Produk */}
                                    <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                                    <h3 className="text-lg font-bold text-foreground">{alert.product}</h3>
                                                </div>
                                                <p className="text-sm text-foreground/50">
                                                    Stok saat ini: <span className="font-bold text-red-500">{alert.currentStock}</span> / Batas minimum: {alert.minStock}
                                                </p>
                                            </div>
                                            <Badge variant={alert.priority === "High" ? "danger" : "warning"}>
                                                Prioritas {alert.priority}
                                            </Badge>
                                        </div>

                                        <div className="mt-6 flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500 transition-all"
                                                    style={{ width: `${(alert.currentStock / alert.minStock) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-foreground/40">{Math.round((alert.currentStock / alert.minStock) * 100)}%</span>
                                        </div>
                                    </div>

                                    {/* Bagian Kanan: Rekomendasi AI Petani Terdekat */}
                                    <div className="flex-1 p-6 bg-primary/[0.03]">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-primary/20 p-1.5 rounded-lg">
                                                <Wheat className="h-4 w-4 text-primary" />
                                            </div>
                                            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Rekomendasi Petani Terdekat</h4>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-foreground/40" />
                                                    <span className="text-sm font-bold text-foreground">{alert.recommendation.farmer}</span>
                                                </div>
                                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {alert.recommendation.distance}
                        </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground/50">Harga Penawaran:</span>
                                                <span className="font-bold text-foreground">{alert.recommendation.price}</span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2">
                                                <Button className="flex-1 font-bold">
                                                    Pesan Sekarang
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" className="px-3 border-border">
                                                    Detail
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="RefreshCw"
                    title="Tidak ada alert restock"
                    description="Semua stok dalam kondisi aman. Alert akan muncul secara otomatis saat stok berada di bawah batas minimum."
                />
            )}
        </div>
    );
}