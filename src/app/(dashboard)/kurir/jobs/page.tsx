"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Package, ArrowRight, Navigation } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import { apiGet, apiPost } from "@/lib/api";

interface JobItem {
    nama: string;
    satuan: string;
    kategori: string;
    jumlah: number;
}

interface AvailableJob {
    id: string;
    orderId: string;
    estimasiJarak: number | null;
    estimasiWaktu: number | null;
    ongkosKirim: number;
    status: string;
    createdAt: string;
    pembeli: { id: string; nama: string };
    items: JobItem[];
    alamatPengiriman: string | null;
}

interface MyJob {
    id: string;
    orderId: string;
    ongkosKirim: number;
    status: string;
    pembeli: { id: string; nama: string; telepon: string };
    items: JobItem[];
    alamatPengiriman: string | null;
}

export default function JobMarketplacePage() {
    const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([]);
    const [myJobs, setMyJobs] = useState<MyJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [tab, setTab] = useState<"available" | "my">("available");

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const [availableRes, myRes] = await Promise.all([
                apiGet<AvailableJob[]>("/kurir/jobs/available"),
                apiGet<MyJob[]>("/kurir/jobs/my"),
            ]);
            if (availableRes.success && availableRes.data) setAvailableJobs(availableRes.data);
            if (myRes.success && myRes.data) setMyJobs(myRes.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleAccept = async (jobId: string) => {
        setAcceptingId(jobId);
        try {
            const res = await apiPost(`/kurir/jobs/${jobId}/accept`, {});
            if (res.success) fetchJobs();
        } catch {
            // silently fail
        } finally {
            setAcceptingId(null);
        }
    };

    if (loading) return <LoadingSpinner />;

    const displayJobs = tab === "available" ? availableJobs : myJobs;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Job Marketplace"
                description="Temukan dan ambil pekerjaan pengiriman yang tersedia"
            />

            {/* Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={tab === "available" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setTab("available")}
                >
                    Tersedia ({availableJobs.length})
                </Button>
                <Button
                    variant={tab === "my" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setTab("my")}
                >
                    Job Saya ({myJobs.length})
                </Button>
            </div>

            {displayJobs.length === 0 ? (
                <EmptyState
                    icon="Briefcase"
                    title={tab === "available" ? "Belum ada job tersedia" : "Belum ada job diambil"}
                    description={tab === "available" ? "Job pengiriman baru akan muncul di sini." : "Ambil job dari tab Tersedia."}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {displayJobs.map((job) => (
                        <Card key={job.id} className="group border-border hover:border-primary/50 transition-all bg-card overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                {job.id.slice(-8).toUpperCase()}
                                            </p>
                                            <h3 className="text-base font-bold text-foreground leading-tight">
                                                {job.pembeli?.nama || "Pembeli"}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-primary">
                                                {formatRupiah(job.ongkosKirim)}
                                            </p>
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase">
                                                Ongkos
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="flex items-center gap-3 rounded-lg bg-foreground/5 p-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {job.items.map((i) => `${i.nama} (${i.jumlah} ${i.satuan})`).join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div className="text-xs text-foreground/60">
                                        <MapPin className="inline h-3 w-3 mr-1" />
                                        {job.alamatPengiriman || "Alamat tidak tersedia"}
                                    </div>

                                    {"estimasiJarak" in job && job.estimasiJarak && (
                                        <div className="text-xs text-foreground/40">
                                            Estimasi jarak: {(job as AvailableJob).estimasiJarak} km
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-border bg-foreground/[0.02] px-5 py-3">
                                    {tab === "my" ? (
                                        <Badge variant={
                                            (job as MyJob).status === "DELIVERED" ? "success" :
                                            (job as MyJob).status === "IN_TRANSIT" ? "warning" :
                                            "info"
                                        }>
                                            {(job as MyJob).status}
                                        </Badge>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <Navigation className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-bold text-foreground">
                                                {"estimasiJarak" in job ? `${(job as AvailableJob).estimasiJarak ?? "—"} km` : "—"}
                                            </span>
                                        </div>
                                    )}
                                    {tab === "available" ? (
                                        <Button
                                            size="sm"
                                            className="font-black px-6 shadow-lg shadow-primary/10"
                                            onClick={() => handleAccept(job.id)}
                                            disabled={acceptingId === job.id}
                                        >
                                            {acceptingId === job.id ? "..." : "AMBIL JOB"}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="font-bold text-xs"
                                            onClick={() => window.location.href = `/kurir/scan-qr`}
                                        >
                                            KONFIRMASI
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
