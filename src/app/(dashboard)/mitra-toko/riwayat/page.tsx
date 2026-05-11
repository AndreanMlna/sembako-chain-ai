"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface RiwayatData {
    transaksi: { id: string; jumlah: number; tipe: string; status: string; createdAt: string; referensi: string | null }[];
    orders: { id: string; status: string; totalHarga: number; createdAt: string; items: string }[];
}

export default function MitraTokoRiwayatPage() {
    const [data, setData] = useState<RiwayatData | null>(null);
    const [tab, setTab] = useState<"orders" | "transaksi">("orders");

    useEffect(() => {
        apiGet<RiwayatData>("/mitra-toko/riwayat").then((res) => {
            if (res.success && res.data) setData(res.data);
        });
    }, []);

    if (!data) return <LoadingSpinner />;

    const items = tab === "orders" ? data.orders : data.transaksi;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader title="Riwayat Toko" description="Riwayat pesanan dan transaksi toko Anda" />

            <div className="flex gap-2">
                {(["orders", "transaksi"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t ? "bg-primary text-white" : "bg-foreground/5 text-foreground/50"}`}>
                        {t === "orders" ? "Pesanan" : "Transaksi"} ({t === "orders" ? data.orders.length : data.transaksi.length})
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {items.map((item: any) => (
                    <Card key={item.id} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tab === "orders" ? "bg-primary/10" : item.tipe === "PEMBAYARAN" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                    {tab === "orders" ? <ShoppingBag className="h-5 w-5 text-primary" /> : item.tipe === "PEMBAYARAN" ? <ArrowDownLeft className="h-5 w-5 text-green-500" /> : <ArrowUpRight className="h-5 w-5 text-red-500" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{tab === "orders" ? item.items : item.tipe}</p>
                                    <p className="text-xs text-foreground/40">{new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-primary">{formatRupiah(tab === "orders" ? item.totalHarga : item.jumlah)}</p>
                                <Badge variant={item.status === "DELIVERED" || item.status === "BERHASIL" ? "success" : "info"}>{item.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && <p className="text-center py-8 text-foreground/40">Belum ada data</p>}
            </div>
        </div>
    );
}
