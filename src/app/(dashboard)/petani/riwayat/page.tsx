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
    penjualan: { id: string; status: string; totalHarga: number; createdAt: string; pembeli: string; items: string }[];
    transaksi: { id: string; jumlah: number; tipe: string; status: string; createdAt: string; referensi: string | null }[];
}

export default function PetaniRiwayatPage() {
    const [data, setData] = useState<RiwayatData | null>(null);
    const [tab, setTab] = useState<"penjualan" | "transaksi">("penjualan");

    useEffect(() => {
        apiGet<RiwayatData>("/petani/riwayat").then((res) => {
            if (res.success && res.data) setData(res.data);
        });
    }, []);

    if (!data) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader title="Riwayat" description="Riwayat penjualan dan transaksi Anda" />

            <div className="flex gap-2">
                {(["penjualan", "transaksi"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t ? "bg-primary text-white" : "bg-foreground/5 text-foreground/50"}`}>
                        {t === "penjualan" ? "Penjualan" : "Transaksi"} ({t === "penjualan" ? data.penjualan.length : data.transaksi.length})
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {tab === "penjualan" ? data.penjualan.map((p) => (
                    <Card key={p.id} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{p.items || "Pesanan"}</p>
                                    <p className="text-xs text-foreground/40">Pembeli: {p.pembeli} • {new Date(p.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-primary">{formatRupiah(p.totalHarga)}</p>
                                <Badge variant={p.status === "DELIVERED" ? "success" : "info"}>{p.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )) : data.transaksi.map((t) => (
                    <Card key={t.id} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.tipe === "PEMBAYARAN" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                    {t.tipe === "PEMBAYARAN" ? <ArrowDownLeft className="h-5 w-5 text-green-500" /> : <ArrowUpRight className="h-5 w-5 text-red-500" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{t.tipe}</p>
                                    <p className="text-xs text-foreground/40">{new Date(t.createdAt).toLocaleDateString("id-ID")} • {t.referensi || "—"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black">{formatRupiah(t.jumlah)}</p>
                                <Badge variant={t.status === "BERHASIL" ? "success" : "danger"}>{t.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(tab === "penjualan" ? data.penjualan : data.transaksi).length === 0 && (
                    <p className="text-center py-8 text-foreground/40">Belum ada data</p>
                )}
            </div>
        </div>
    );
}
