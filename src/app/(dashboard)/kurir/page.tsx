"use client";

import { Briefcase, Truck, Star, Wallet, MapPin, Package, Navigation, Clock } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function KurirDashboard() {
    // Dummy data untuk Job Aktif
    const activeJob = {
        id: "DEL-9921",
        from: "Gudang Tani Jaya, Tegal",
        to: "Toko Sembako Berkah, Slawi",
        distance: "5.2 km",
        status: "Dalam Perjalanan",
        items: "10 Karung Beras"
    };

    // Dummy data untuk Pengiriman Terakhir
    const recentDeliveries = [
        { id: "DEL-9918", dest: "Warung Bu Siti", time: "2 jam lalu", fee: "Rp 25.000" },
        { id: "DEL-9915", dest: "Katering Berkah", time: "5 jam lalu", fee: "Rp 45.000" },
    ];

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Dashboard Kurir"
                description="Pantau tugas pengiriman dan pendapatan Anda"
                action={
                    <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Cari Job Baru
                    </Button>
                }
            />

            {/* STATS SECTION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Job Tersedia" value="8" icon="Briefcase" />
                <StatsCard
                    title="Pengiriman Hari Ini"
                    value="5"
                    icon="Truck"
                    trend={{ value: 10, isPositive: true }}
                />
                <StatsCard title="Rating" value="4.8" icon="Star" />
                <StatsCard
                    title="Pendapatan Hari Ini"
                    value="Rp 185.000"
                    icon="Wallet"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* JOB AKTIF */}
                <Card className="border-primary/20 bg-primary/5 shadow-none">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Job Aktif</h3>
                            </div>
                            <Badge variant="warning" className="animate-pulse">Selesaikan Segera</Badge>
                        </div>

                        <div className="space-y-4 rounded-xl bg-card p-4 border border-border">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{activeJob.items}</p>
                                    <p className="text-[10px] text-foreground/40 uppercase font-black">{activeJob.id}</p>
                                </div>
                            </div>

                            <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:h-10 before:w-0.5 before:bg-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                                    <p className="text-xs text-foreground/70"><span className="font-bold">Dari:</span> {activeJob.from}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 rounded-full border-2 border-red-500 bg-background z-10" />
                                    <p className="text-xs text-foreground/70"><span className="font-bold">Ke:</span> {activeJob.to}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button className="w-full font-bold">
                                    Buka Peta Navigasi
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PENGIRIMAN TERAKHIR */}
                <Card className="border-border">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-foreground/40" />
                            <h3 className="text-lg font-bold text-foreground">Pengiriman Terakhir</h3>
                        </div>

                        <div className="space-y-3">
                            {recentDeliveries.map((delivery) => (
                                <div key={delivery.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-foreground/[0.02] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{delivery.dest}</p>
                                            <p className="text-xs text-foreground/50">{delivery.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{delivery.fee}</p>
                                        <p className="text-[10px] text-foreground/30 font-bold">SUKSES</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-foreground/40">
                                Lihat Semua Riwayat
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}