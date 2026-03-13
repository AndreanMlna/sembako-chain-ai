"use client";

import { useState } from "react";
import { History, MapPin, Package, Calendar, Search, Download, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";

// Dummy Data Riwayat Pengiriman Kurir
const DELIVERY_HISTORY = [
    {
        id: "DEL-9920",
        date: "14 Mar 2026",
        time: "09:30",
        store: "Toko Sembako Berkah",
        item: "10 Karung Beras",
        pickup: "Gudang Tani Jaya",
        dropoff: "Slawi, Tegal",
        fee: 35000,
        distance: "6.2 km",
        status: "Selesai"
    },
    {
        id: "DEL-9918",
        date: "13 Mar 2026",
        time: "15:45",
        store: "Mitra Tani Sejahtera",
        item: "5 Karton Minyak Goreng",
        pickup: "Pasar Pagi Tegal",
        dropoff: "Mejasem",
        fee: 15000,
        distance: "2.5 km",
        status: "Selesai"
    },
    {
        id: "DEL-9915",
        date: "13 Mar 2026",
        time: "11:20",
        store: "Warung Madura Jaya",
        item: "20 Kg Gula Pasir",
        pickup: "Gudang Bulog",
        dropoff: "Kramat",
        fee: 22000,
        distance: "4.8 km",
        status: "Selesai"
    }
];

export default function RiwayatKurirPage() {
    const [history] = useState(DELIVERY_HISTORY);

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Riwayat Pengiriman"
                description="Pantau semua pekerjaan yang telah Anda selesaikan"
                action={
                    <Button variant="outline" size="sm" className="font-bold border-border bg-card">
                        <Download className="mr-2 h-4 w-4" />
                        Rekap Gaji
                    </Button>
                }
            />

            {/* Filter & Search */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Cari ID pengiriman atau nama toko..."
                        onSearch={(q) => console.log(q)}
                    />
                </div>
                <Button variant="outline" className="h-11 border-border bg-card font-bold">
                    <Calendar className="mr-2 h-4 w-4" />
                    Filter Tanggal
                </Button>
            </div>

            {history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((job) => (
                        <Card key={job.id} className="border-border bg-card hover:border-primary/50 transition-all overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">

                                    {/* Info Status & ID */}
                                    <div className="flex items-center gap-4 md:w-1/4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{job.id}</p>
                                            <p className="text-sm font-bold text-foreground">{job.date}</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase">{job.time} WIB</p>
                                        </div>
                                    </div>

                                    {/* Route Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Pickup:</span> {job.pickup}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Dropoff:</span> {job.dropoff}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Earnings & Details */}
                                    <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center md:w-1/4 gap-1">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Ongkos Kirim</p>
                                            <p className="text-lg font-black text-primary">Rp {job.fee.toLocaleString("id-ID")}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/40 uppercase">
                                            <MapPin className="h-3 w-3" />
                                            {job.distance}
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Item Info */}
                                <div className="bg-foreground/[0.02] border-t border-border px-5 py-2 flex items-center gap-2">
                                    <Package className="h-3 w-3 text-foreground/30" />
                                    <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                                        Muatan: <span className="text-foreground">{job.item}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="History"
                    title="Belum ada riwayat"
                    description="Riwayat pengiriman akan muncul setelah Anda menyelesaikan pekerjaan pertama Anda."
                />
            )}
        </div>
    );
}