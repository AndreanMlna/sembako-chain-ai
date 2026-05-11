"use client";

import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, Info, Package, RefreshCw } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { apiGet, apiPost } from "@/lib/api";

interface MyJob {
    id: string;
    orderId: string;
    ongkosKirim: number;
    status: string;
    createdAt: string;
    pembeli: { id: string; nama: string; telepon: string };
    items: { nama: string; satuan: string; jumlah: number }[];
    alamatPengiriman: string | null;
}

interface QRData {
    jobId: string;
    orderId: string;
    token: string;
    qrCode: string;
    pembeli: string;
    items: string;
    alamatPengiriman: string | null;
}

export default function ScanQRPage() {
    const [myJobs, setMyJobs] = useState<MyJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState<QRData | null>(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [confirming, setConfirming] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState<string | null>(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await apiGet<MyJob[]>("/kurir/jobs/my");
            if (res.success && res.data) setMyJobs(res.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const activeJobs = myJobs.filter((j) => j.status !== "DELIVERED");
    const completedJobs = myJobs.filter((j) => j.status === "DELIVERED");

    const generateQR = async (jobId: string) => {
        setQrLoading(true);
        setQrData(null);
        try {
            const res = await apiGet<QRData>(`/kurir/jobs/${jobId}/qr`);
            if (res.success && res.data) setQrData(res.data);
        } catch {
            // silently fail
        } finally {
            setQrLoading(false);
        }
    };

    const handleConfirm = async (jobId: string) => {
        setConfirming(jobId);
        try {
            const res = await apiPost(`/kurir/jobs/${jobId}/confirm`, {});
            if (res.success) {
                setConfirmed(jobId);
                setQrData(null);
                fetchJobs();
            }
        } catch {
            // silently fail
        } finally {
            setConfirming(null);
        }
    };

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            PICKED_UP: "Dijemput",
            IN_TRANSIT: "Dalam Perjalanan",
            DELIVERED: "Terkirim",
            PENDING: "Pending",
        };
        return map[status] || status;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Scan QR Bukti Kirim"
                description="Konfirmasi serah terima pesanan ke pembeli"
            />

            <div className="mx-auto max-w-md space-y-6">
                {/* ACTIVE JOBS */}
                {activeJobs.length === 0 ? (
                    <Card className="border-border bg-card overflow-hidden">
                        <CardContent className="p-8 text-center">
                            <Package className="mx-auto h-12 w-12 text-foreground/20 mb-4" />
                            <p className="font-bold text-foreground">Tidak ada job aktif</p>
                            <p className="text-sm text-foreground/50 mt-1">
                                Ambil job dari marketplace terlebih dahulu
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    activeJobs.map((job) => (
                        <Card key={job.id} className="border-primary/20 bg-card overflow-hidden shadow-xl shadow-primary/5">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                                            {job.id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                            {job.pembeli?.nama || "Pembeli"}
                                        </p>
                                    </div>
                                    <Badge variant="warning">{getStatusLabel(job.status)}</Badge>
                                </div>

                                <p className="text-xs text-foreground/60 mb-4">
                                    {job.items.map((i) => `${i.nama} (${i.jumlah} ${i.satuan})`).join(", ")}
                                </p>

                                {confirmed === job.id ? (
                                    <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4 mb-4">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        <div>
                                            <p className="font-bold text-foreground">Terkonfirmasi!</p>
                                            <p className="text-xs text-foreground/50">Pesanan telah sampai ke pembeli</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* QR Code Display */}
                                        {qrData && qrData.jobId === job.id ? (
                                            <div className="text-center mb-4">
                                                <div className="bg-white p-4 rounded-xl inline-block mb-3">
                                                    <img
                                                        src={qrData.qrCode}
                                                        alt="QR Code"
                                                        className="h-48 w-48"
                                                    />
                                                </div>
                                                <p className="text-xs text-foreground/50">
                                                    Minta pembeli scan QR ini untuk konfirmasi
                                                </p>
                                            </div>
                                        ) : null}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                size="sm"
                                                onClick={() => generateQR(job.id)}
                                                disabled={qrLoading}
                                            >
                                                <QrCode className="mr-2 h-4 w-4" />
                                                {qrLoading ? "Loading..." : "Tampilkan QR"}
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                size="sm"
                                                onClick={() => handleConfirm(job.id)}
                                                disabled={confirming === job.id}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {confirming === job.id ? "..." : "Konfirmasi"}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}

                {/* COMPLETED JOBS */}
                {completedJobs.length > 0 && (
                    <Card className="border-border bg-card/50">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-bold text-foreground mb-4">
                                Riwayat Konfirmasi ({completedJobs.length})
                            </h3>
                            <div className="space-y-3">
                                {completedJobs.slice(0, 5).map((job) => (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between rounded-xl bg-foreground/5 p-3 border border-border/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-foreground uppercase">
                                                    {job.id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-[10px] text-foreground/40 font-bold">
                                                    {job.pembeli?.nama || "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase">
                                            SUKSES
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* AI Tip */}
                <div className="flex gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
                    <Info className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                        Tampilkan QR ke pembeli untuk verifikasi, atau konfirmasi manual setelah pesanan diterima.
                    </p>
                </div>
            </div>
        </div>
    );
}
