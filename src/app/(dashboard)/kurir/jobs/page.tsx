"use client";

import { useState } from "react";
import { Briefcase, MapPin, Package, ArrowRight, Filter, Wallet, Navigation } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SearchBar from "@/components/shared/SearchBar";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Dummy Data Job Tersedia
const AVAILABLE_JOBS = [
    {
        id: "JOB-101",
        store: "Toko Sembako Berkah",
        item: "5 Karung Beras (25kg)",
        pickup: "Gudang Tani Jaya, Tegal",
        dropoff: "Jl. Ahmad Yani No. 12, Slawi",
        distance: "4.2 km",
        fee: 25000,
        urgent: true
    },
    {
        id: "JOB-102",
        store: "Mitra Tani Sejahtera",
        item: "10 Karton Minyak Goreng",
        pickup: "Pasar Pagi Tegal",
        dropoff: "Warung Bu Siti, Mejasem",
        distance: "2.8 km",
        fee: 18000,
        urgent: false
    },
    {
        id: "JOB-103",
        store: "Koperasi Unit Desa",
        item: "20 Kg Telur Ayam",
        pickup: "Peternakan Ayam Slawi",
        dropoff: "Pasar Trayeman",
        distance: "6.5 km",
        fee: 35000,
        urgent: false
    }
];

export default function JobMarketplacePage() {
    const [jobs] = useState(AVAILABLE_JOBS);

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Job Marketplace"
                description="Temukan dan ambil pekerjaan pengiriman yang tersedia di sekitar Anda"
            />

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Cari berdasarkan area pickup atau dropoff..."
                        onSearch={(q) => console.log("Search:", q)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 border-border bg-card">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="h-11 border-border bg-card">
                        <Navigation className="mr-2 h-4 w-4" />
                        Terdekat
                    </Button>
                </div>
            </div>

            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {jobs.map((job) => (
                        <Card key={job.id} className={cn(
                            "group border-border hover:border-primary/50 transition-all bg-card overflow-hidden",
                            job.urgent && "border-l-4 border-l-red-500"
                        )}>
                            <CardContent className="p-0">
                                <div className="p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.id}</span>
                                                {job.urgent && <Badge variant="danger" className="text-[9px] px-1.5 h-4">URGENT</Badge>}
                                            </div>
                                            <h3 className="text-base font-bold text-foreground leading-tight">{job.store}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-primary">Rp {job.fee.toLocaleString("id-ID")}</p>
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Estimasi Pendapatan</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg bg-foreground/5 p-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Muatan:</p>
                                            <p className="text-sm font-bold text-foreground">{job.item}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:h-10 before:w-0.5 before:bg-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Pickup:</span> {job.pickup}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 rounded-full border-2 border-red-500 bg-background z-10" />
                                            <p className="text-xs text-foreground/60 leading-tight">
                                                <span className="font-bold text-foreground">Dropoff:</span> {job.dropoff}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-border bg-foreground/[0.02] px-5 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold text-foreground">{job.distance}</span>
                                    </div>
                                    <Button size="sm" className="font-black px-6 shadow-lg shadow-primary/10">
                                        AMBIL JOB
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="Briefcase"
                    title="Belum ada job tersedia"
                    description="Job pengiriman baru akan muncul di sini. Pastikan status Anda 'Tersedia'."
                />
            )}
        </div>
    );
}