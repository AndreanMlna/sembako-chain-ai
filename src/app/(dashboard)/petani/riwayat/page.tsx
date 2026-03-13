"use client";

import { History, Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatRupiah, cn } from "@/lib/utils";

export default function RiwayatPetaniPage() {
    // Mock data riwayat - Nanti ganti dengan fetch API
    const hasData = true;
    const dataRiwayat = [
        {
            id: "TX-001",
            tipe: "Penjualan",
            keterangan: "Penjualan Padi Ciherang ke Toko Berkah",
            nominal: 4500000,
            tgl: "12 Mar 2026",
            status: "Berhasil",
        },
        {
            id: "TX-002",
            tipe: "Tarik Dana",
            keterangan: "Penarikan ke Bank BCA",
            nominal: 1500000,
            tgl: "10 Mar 2026",
            status: "Proses",
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Riwayat"
                description="Pantau semua riwayat penjualan dan transaksi finansial Anda"
            />

            {!hasData ? (
                <EmptyState
                    icon="History"
                    title="Belum ada riwayat"
                    description="Riwayat transaksi akan muncul setelah Anda melakukan penjualan atau aktivitas finansial."
                />
            ) : (
                <div className="space-y-4">
                    {/* Filter & Search Bar Mini */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Cari transaksi..."
                                className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/5">
                                <Filter className="h-4 w-4" /> Filter
                            </button>
                        </div>
                    </div>

                    {/* List Riwayat */}
                    <div className="space-y-3">
                        {dataRiwayat.map((item) => (
                            <Card key={item.id} className="group transition-all hover:border-primary/30">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Icon Tipe Transaksi */}
                                        <div className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                            item.tipe === "Penjualan" ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {item.tipe === "Penjualan" ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                                        </div>

                                        <div>
                                            <p className="font-bold text-foreground">{item.tipe}</p>
                                            <p className="text-xs text-foreground/50">{item.keterangan}</p>
                                            <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground/30 font-semibold">{item.id} • {item.tgl}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={cn(
                                            "text-lg font-bold",
                                            item.tipe === "Penjualan" ? "text-primary" : "text-foreground"
                                        )}>
                                            {item.tipe === "Penjualan" ? "+" : "-"} {formatRupiah(item.nominal)}
                                        </p>
                                        <Badge variant={item.status === "Berhasil" ? "success" : "warning"} className="mt-1">
                                            {item.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}