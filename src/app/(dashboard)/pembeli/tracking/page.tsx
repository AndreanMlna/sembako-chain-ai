"use client";

import { useState } from "react";
import { Search, MapPin, Truck, CheckCircle2, Clock, Phone, Box, Navigation, Package } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface TrackingStep {
    label: string;
    done: boolean;
    date: string | null;
}

interface OrderTracking {
    id: string;
    status: string;
    totalHarga: number;
    ongkosKirim: number;
    alamatPengiriman: string;
    createdAt: string;
    items: { nama: string; satuan: string; jumlah: number }[];
    tracking: TrackingStep[];
    kurir: { nama: string; telepon: string } | null;
    estimasiWaktu: number | null;
    estimasiJarak: number | null;
}

export default function TrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [tracking, setTracking] = useState<OrderTracking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async () => {
        if (!orderId.trim()) return;
        setLoading(true);
        setError("");
        setTracking(null);
        try {
            const res = await apiGet<OrderTracking>(`/pembeli/orders/${orderId.trim()}`);
            if (res.success && res.data) {
                setTracking(res.data);
            } else {
                setError(res.message || "Pesanan tidak ditemukan");
            }
        } catch {
            setError("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status: string) => {
        const m: Record<string, string> = {
            PENDING: "Pending", CONFIRMED: "Dikonfirmasi", PICKED_UP: "Dijemput",
            IN_TRANSIT: "Dalam Perjalanan", DELIVERED: "Terkirim", CANCELLED: "Dibatalkan",
        };
        return m[status] || status;
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader title="Tracking Pengiriman" description="Pantau posisi kurir dan estimasi waktu tiba pesanan Anda" />

            <Card className="border-border bg-card/50">
                <CardContent className="p-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                        <Input
                            placeholder="Masukkan Order ID..."
                            className="pl-10 bg-background border-border"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                        />
                    </div>
                    <Button className="font-bold shadow-lg shadow-primary/20" onClick={handleTrack} disabled={loading}>
                        {loading ? "..." : "LACAK"}
                    </Button>
                </CardContent>
            </Card>

            {loading && <LoadingSpinner />}
            {error && <div className="text-center py-8 text-red-500 text-sm">{error}</div>}

            {tracking && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* MAP PLACEHOLDER */}
                    <div className="lg:col-span-2">
                        <Card className="h-[400px] border-border bg-card relative overflow-hidden">
                            <div className="absolute inset-0 bg-foreground/5 opacity-40" />
                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                {tracking.kurir && tracking.status === "IN_TRANSIT" ? (
                                    <>
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
                                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                                                <Truck className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="mt-3 rounded-lg bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 shadow-lg">
                                            <p className="text-[10px] font-black text-primary uppercase">
                                                Kurir: {tracking.kurir.nama}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <Package className="h-16 w-16 text-foreground/10" />
                                )}
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                <div className="bg-background/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl">
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Estimasi Tiba</p>
                                    <p className="text-xl font-black text-foreground">
                                        {tracking.estimasiWaktu ? `${tracking.estimasiWaktu} Menit` : "—"}
                                    </p>
                                </div>
                                <Badge variant="info">{getStatusLabel(tracking.status)}</Badge>
                            </div>
                        </Card>
                    </div>

                    {/* TIMELINE */}
                    <div className="space-y-4">
                        <Card className="border-border bg-card h-full">
                            <CardContent className="p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                                    <Box className="h-5 w-5 text-primary" />
                                    Status Pesanan
                                </h3>
                                <p className="text-[10px] text-foreground/40 mb-6">
                                    Order #{tracking.id.slice(-8).toUpperCase()}
                                </p>

                                <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border/50">
                                    {tracking.tracking.map((step, idx) => (
                                        <div key={idx} className="relative flex items-start gap-6 pl-8">
                                            <div className={cn(
                                                "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                                                step.done ? "bg-green-500" : "bg-border"
                                            )}>
                                                {step.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn("text-sm font-bold", step.done ? "text-foreground" : "text-foreground/40")}>
                                                    {step.label}
                                                </p>
                                                {step.date && (
                                                    <p className="text-[10px] text-foreground/30 mt-1">
                                                        {new Date(step.date).toLocaleString("id-ID")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {tracking.kurir && (
                                    <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/10 p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-foreground uppercase">{tracking.kurir.nama}</p>
                                                <p className="text-[10px] text-foreground/40">{tracking.kurir.telepon}</p>
                                            </div>
                                            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 space-y-2 text-sm border-t border-border pt-4">
                                    <div className="flex justify-between"><span className="text-foreground/50">Items</span><span>{tracking.items.map(i => i.nama).join(", ")}</span></div>
                                    <div className="flex justify-between"><span className="text-foreground/50">Alamat</span><span className="text-right max-w-[60%]">{tracking.alamatPengiriman || "—"}</span></div>
                                    <div className="flex justify-between"><span className="text-foreground/50">Total</span><span className="font-bold">{formatRupiah(tracking.totalHarga)}</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
