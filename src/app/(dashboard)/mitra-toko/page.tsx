"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, CreditCard, ShoppingCart, History } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { apiGet } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";

interface DashboardData {
    totalProduk: number;
    stokRendah: number;
    transaksiHariIni: number;
    pendapatanHariIni: number;
    lowStockItems: Array<{
        id: string;
        stok: number;
        minStok: number;
        produk: { id: string; nama: string; satuan: string };
    }>;
}

export default function MitraTokoDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet<DashboardData>("/mitra-toko/dashboard")
            .then((res) => {
                if (res.success && res.data) setData(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Dashboard Mitra Toko"
                description="Ringkasan inventori dan penjualan toko Anda"
                action={
                    <a href="/mitra-toko/pos">
                        <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Buka POS
                        </Button>
                    </a>
                }
            />

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Produk"
                    value={data?.totalProduk ?? 0}
                    icon="Package"
                />
                <StatsCard
                    title="Stok Rendah"
                    value={data?.stokRendah ?? 0}
                    icon="AlertTriangle"
                    trend={
                        (data?.stokRendah ?? 0) > 0
                            ? { value: data!.stokRendah, isPositive: false }
                            : undefined
                    }
                />
                <StatsCard
                    title="Pendapatan Hari Ini"
                    value={formatRupiah(data?.pendapatanHariIni ?? 0)}
                    icon="CreditCard"
                />
                <StatsCard
                    title="Transaksi Hari Ini"
                    value={data?.transaksiHariIni ?? 0}
                    icon="ShoppingCart"
                />
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
                            <Badge variant={data && data.stokRendah > 0 ? "danger" : "default"}>
                                {data?.stokRendah ?? 0} Produk
                            </Badge>
                        </div>

                        {data?.lowStockItems && data.lowStockItems.length > 0 ? (
                            <div className="space-y-4">
                                {data.lowStockItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-lg bg-foreground/5 p-3"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {item.produk.nama}
                                            </p>
                                            <p className="text-xs text-foreground/50">
                                                Stok: {item.stok} / Min: {item.minStok}{" "}
                                                {item.produk.satuan}
                                            </p>
                                        </div>
                                        <a href="/mitra-toko/inventory">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs border-primary/50 text-primary"
                                            >
                                                Restock
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-foreground/50 py-4 text-center">
                                Semua stok aman — tidak ada yang di bawah minimum.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* QUICK LINKS */}
                <Card className="border-primary/10">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Akses Cepat</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Inventori", href: "/mitra-toko/inventory", icon: "Package" },
                                { label: "Restock", href: "/mitra-toko/restock", icon: "AlertTriangle" },
                                { label: "POS Kasir", href: "/mitra-toko/pos", icon: "CreditCard" },
                                { label: "Riwayat", href: "/mitra-toko/riwayat", icon: "History" },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 rounded-lg border border-border p-4 hover:bg-foreground/5 transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                        {link.label.slice(0, 2)}
                                    </div>
                                    <span className="text-sm font-bold text-foreground">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
