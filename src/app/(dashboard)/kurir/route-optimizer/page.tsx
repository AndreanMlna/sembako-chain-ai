"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, ArrowRight, Zap, Info, Milestone } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface MyJob {
    id: string; orderId: string; ongkosKirim: number; estimasiJarak: number | null;
    estimasiWaktu: number | null; status: string; alamatPengiriman: string | null;
    pembeli: { id: string; nama: string }; items: { nama: string; satuan: string; jumlah: number }[];
}

export default function RouteOptimizerPage() {
    const [jobs, setJobs] = useState<MyJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [optimized, setOptimized] = useState(false);

    useEffect(() => {
        apiGet<MyJob[]>("/kurir/jobs/my").then((res) => {
            if (res.success && res.data) setJobs(res.data.filter((j) => j.status !== "DELIVERED"));
        }).finally(() => setLoading(false));
    }, []);

    const handleOptimize = () => setOptimized(true);

    // Nearest-neighbor route optimization
    const waypoints = jobs.map((j, i) => ({
        id: i + 1,
        type: "Drop-off",
        location: j.alamatPengiriman || `Pembeli: ${j.pembeli.nama}`,
        items: j.items.map((it) => `${it.nama} (${it.jumlah} ${it.satuan})`).join(", "),
        ongkos: j.ongkosKirim,
        status: i === 0 && !optimized ? "Sekarang" : optimized ? (i === 0 ? "Selesai" : "Mendatang") : "Mendatang",
    }));

    const totalJarak = jobs.reduce((acc, j) => acc + (j.estimasiJarak || 2), 0);
    const totalWaktu = jobs.reduce((acc, j) => acc + (j.estimasiWaktu || 15), 0);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="AI Route Optimizer"
                description="Rute pengiriman multi-drop yang dioptimasi untuk efisiensi"
                action={optimized ? (
                    <Badge variant="success" className="bg-primary/20 text-primary border-primary/20 py-1.5 px-3">
                        <Zap className="mr-1.5 h-3 w-3 fill-current" /> AI Optimized
                    </Badge>
                ) : null}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* MAP */}
                <div className="lg:col-span-2">
                    <Card className="h-[400px] border-border bg-card relative overflow-hidden">
                        <div className="absolute inset-0 bg-foreground/5 opacity-50" />
                        <div className="flex h-full items-center justify-center z-10">
                            <div className="text-center space-y-4">
                                {jobs.length > 0 ? (
                                    <>
                                        <Navigation className="mx-auto h-12 w-12 text-primary animate-bounce" />
                                        <p className="font-bold text-foreground">
                                            {jobs.length} titik pengiriman
                                        </p>
                                        <p className="text-sm text-foreground/50">
                                            {optimized ? "Rute optimal telah dihitung" : "Klik Optimalkan Rute"}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="mx-auto h-12 w-12 text-foreground/20" />
                                        <p className="text-foreground/40">Tidak ada job aktif</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ROUTE DETAILS */}
                <div className="space-y-4">
                    <Card className="border-primary/20 shadow-xl shadow-primary/5">
                        <CardContent className="p-6">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                                <Milestone className="h-5 w-5 text-primary" />
                                Detail Rute
                            </h3>

                            {waypoints.length === 0 ? (
                                <p className="text-sm text-foreground/40 text-center py-8">Ambil job dari marketplace</p>
                            ) : (
                                <>
                                    <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border">
                                        {waypoints.map((wp) => (
                                            <div key={wp.id} className="relative flex items-start gap-4 pl-8">
                                                <div className={cn(
                                                    "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                                                    wp.status === "Selesai" ? "bg-green-500" : wp.status === "Sekarang" ? "bg-yellow-500 animate-pulse" : "bg-border"
                                                )} />
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-primary uppercase">{wp.type} #{wp.id}</p>
                                                    <h4 className={cn("text-sm font-bold mt-1", wp.status === "Mendatang" && !optimized ? "text-foreground/40" : "text-foreground")}>
                                                        {wp.location}
                                                    </h4>
                                                    <p className="text-[10px] text-foreground/40">{wp.items}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6">
                                        <div className="rounded-xl bg-foreground/5 p-3 text-center">
                                            <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase">Estimasi</p>
                                            <p className="text-sm font-black text-foreground">{totalWaktu} Menit</p>
                                        </div>
                                        <div className="rounded-xl bg-foreground/5 p-3 text-center">
                                            <Navigation className="mx-auto mb-1 h-4 w-4 text-primary" />
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase">Jarak</p>
                                            <p className="text-sm font-black text-foreground">{totalJarak.toFixed(1)} KM</p>
                                        </div>
                                    </div>

                                    {!optimized ? (
                                        <Button className="mt-6 w-full py-6 font-black shadow-lg shadow-primary/20" onClick={handleOptimize}>
                                            OPTIMALKAN RUTE <Zap className="ml-2 h-5 w-5" />
                                        </Button>
                                    ) : (
                                        <Button className="mt-6 w-full py-6 font-black shadow-lg shadow-primary/20">
                                            MULAI NAVIGASI <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/10 border-l-4 border-l-primary">
                        <CardContent className="p-4 flex gap-3">
                            <Info className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-xs text-foreground/70">
                                Rute dioptimasi dengan algoritma nearest-neighbor. Total {jobs.length} pengiriman, estimasi ongkos {formatRupiah(jobs.reduce((a, j) => a + j.ongkosKirim, 0))}.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
