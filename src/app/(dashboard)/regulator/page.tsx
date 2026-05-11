"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, Activity, Users, Package, Store, Truck, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface DashboardData {
    totalPetani: number; totalToko: number; totalKurir: number;
    totalProduk: number; totalOrders: number; totalTransaksi: number;
    inflasiData: { komoditas: string; hargaRataRata: number; jumlahProduk: number }[];
}

export default function RegulatorDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        apiGet<DashboardData>("/regulator/dashboard").then((res) => {
            if (res.success && res.data) setData(res.data);
        });
    }, []);

    if (!data) return <LoadingSpinner />;

    const avgPrice = Math.round(data.inflasiData.reduce((a, i) => a + i.hargaRataRata, 0) / Math.max(data.inflasiData.length, 1));

    return (
        <div className="space-y-8 animate-in pb-20">
            <PageHeader title="Dashboard Regulator" description="Monitoring inflasi pangan dan stok nasional" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Harga Rata-rata" value={formatRupiah(avgPrice)} icon="TrendingUp" />
                <StatsCard title="Total Petani" value={data.totalPetani} icon="Users" />
                <StatsCard title="Mitra Toko" value={data.totalToko} icon="Store" />
                <StatsCard title="Kurir Aktif" value={data.totalKurir} icon="Truck" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Produk" value={data.totalProduk} icon="Package" />
                <StatsCard title="Total Order" value={data.totalOrders} icon="ShoppingCart" />
                <StatsCard title="Total Transaksi" value={data.totalTransaksi} icon="Activity" />
                <StatsCard
                    title="Lapangan Kerja"
                    value={data.totalPetani + data.totalKurir + data.totalToko}
                    icon="Users"
                    trend={{ value: 100, isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Inflasi Data */}
                <Card className="border-border">
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Harga per Komoditas
                        </h3>
                        <div className="space-y-3">
                            {data.inflasiData.map((item) => (
                                <div key={item.komoditas} className="flex items-center justify-between rounded-lg bg-foreground/5 p-3">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{item.komoditas}</p>
                                        <p className="text-[10px] text-foreground/40">{item.jumlahProduk} produk</p>
                                    </div>
                                    <p className="text-sm font-black text-primary">{formatRupiah(item.hargaRataRata)}</p>
                                </div>
                            ))}
                            {data.inflasiData.length === 0 && (
                                <p className="text-sm text-foreground/40 text-center py-4">Belum ada data komoditas</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-border">
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Monitoring & Aksi
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Inflasi", href: "/regulator/inflasi", icon: "TrendingUp", desc: "Pantau harga" },
                                { label: "Heatmap", href: "/regulator/heatmap", icon: "Map", desc: "Peta stok" },
                                { label: "Intervensi", href: "/regulator/intervensi", icon: "Zap", desc: "Aksi pasar" },
                                { label: "Laporan", href: "/regulator/laporan", icon: "FileText", desc: "Generate" },
                            ].map((link) => (
                                <a key={link.href} href={link.href} className="rounded-lg border border-border p-4 hover:bg-foreground/5 transition-colors">
                                    <p className="text-sm font-bold text-foreground">{link.label}</p>
                                    <p className="text-[10px] text-foreground/40 mt-1">{link.desc}</p>
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
