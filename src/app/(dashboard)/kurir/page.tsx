"use client";

import { useState, useEffect } from "react";
import { Briefcase, Truck, Star, Wallet, Package, Navigation, Clock, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface MyJob {
    id: string;
    orderId: string;
    ongkosKirim: number;
    estimasiJarak: number | null;
    estimasiWaktu: number | null;
    status: string;
    pembeli: { id: string; nama: string; telepon: string };
    items: { nama: string; satuan: string; jumlah: number }[];
    alamatPengiriman: string | null;
}

interface KurirProfile {
    rating: number;
    isAvailable: boolean;
}

export default function KurirDashboard() {
    const [myJobs, setMyJobs] = useState<MyJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ available: 0, myJobs: 0, pendapatan: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [availableRes, myRes] = await Promise.all([
                    apiGet<unknown[]>("/kurir/jobs/available"),
                    apiGet<MyJob[]>("/kurir/jobs/my"),
                ]);
                if (availableRes.data) setStats((s) => ({ ...s, available: (availableRes.data as unknown[]).length }));
                if (myRes.success && myRes.data) {
                    const jobs = myRes.data;
                    setMyJobs(jobs);
                    const total = jobs.reduce((acc, j) => acc + j.ongkosKirim, 0);
                    setStats((s) => ({ ...s, myJobs: jobs.length, pendapatan: total }));
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeJob = myJobs.find((j) => j.status !== "DELIVERED");
    const completedJobs = myJobs.filter((j) => j.status === "DELIVERED");

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            PENDING: "Pending",
            PICKED_UP: "Dijemput",
            IN_TRANSIT: "Dalam Perjalanan",
            DELIVERED: "Terkirim",
        };
        return map[status] || status;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Dashboard Kurir"
                description="Pantau tugas pengiriman dan pendapatan Anda"
                action={
                    <a href="/kurir/jobs">
                        <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Cari Job Baru
                        </Button>
                    </a>
                }
            />

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Job Tersedia" value={stats.available} icon="Briefcase" />
                <StatsCard title="Job Saya" value={stats.myJobs} icon="Truck" />
                <StatsCard title="Rating" value="4.8" icon="Star" />
                <StatsCard title="Pendapatan" value={formatRupiah(stats.pendapatan)} icon="Wallet" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* ACTIVE JOB */}
                <Card className={activeJob ? "border-primary/20 bg-primary/5 shadow-none" : "border-border"}>
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Job Aktif</h3>
                            </div>
                            {activeJob && (
                                <Badge variant="warning" className="animate-pulse">
                                    {getStatusLabel(activeJob.status)}
                                </Badge>
                            )}
                        </div>

                        {activeJob ? (
                            <div className="space-y-4 rounded-xl bg-card p-4 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            {activeJob.items.map((i) => `${i.nama} (${i.jumlah} ${i.satuan})`).join(", ")}
                                        </p>
                                        <p className="text-[10px] text-foreground/40 uppercase font-black">
                                            {activeJob.id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-foreground/40" />
                                        <p className="text-xs text-foreground/70">
                                            <span className="font-bold">Tujuan:</span> {activeJob.alamatPengiriman || "—"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-xs">Pembeli:</span>
                                        <span>{activeJob.pembeli.nama}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        className="flex-1 font-bold"
                                        size="sm"
                                        onClick={() => window.location.href = "/kurir/route-optimizer"}
                                    >
                                        Navigasi
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.href = "/kurir/scan-qr"}
                                    >
                                        Scan QR
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-foreground/40">
                                <Package className="mx-auto h-10 w-10 mb-2 opacity-30" />
                                <p className="font-medium">Tidak ada job aktif</p>
                                <p className="text-sm">Ambil job dari marketplace</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* COMPLETED JOBS */}
                <Card className="border-border">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-foreground/40" />
                            <h3 className="text-lg font-bold text-foreground">Pengiriman Terakhir</h3>
                        </div>

                        {completedJobs.length > 0 ? (
                            <div className="space-y-3">
                                {completedJobs.slice(0, 5).map((job) => (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-foreground/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    {job.pembeli.nama}
                                                </p>
                                                <p className="text-xs text-foreground/50">
                                                    {job.items.map((i) => i.nama).join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary">
                                                {formatRupiah(job.ongkosKirim)}
                                            </p>
                                            <p className="text-[10px] text-green-500 font-bold">SUKSES</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-foreground/40">
                                <Clock className="mx-auto h-10 w-10 mb-2 opacity-30" />
                                <p className="font-medium">Belum ada pengiriman selesai</p>
                            </div>
                        )}

                        <a href="/kurir/riwayat">
                            <Button variant="ghost" className="w-full text-xs text-foreground/40 mt-3">
                                Lihat Semua Riwayat
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
