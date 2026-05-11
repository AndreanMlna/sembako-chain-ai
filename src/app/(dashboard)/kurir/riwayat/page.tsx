"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import StatsCard from "@/components/cards/StatsCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface RiwayatData {
    totalPengiriman: number;
    totalPendapatan: number;
    riwayat: { id: string; orderId: string; ongkosKirim: number; estimasiJarak: number | null; status: string; updatedAt: string; pembeli: string; items: string }[];
}

export default function KurirRiwayatPage() {
    const [data, setData] = useState<RiwayatData | null>(null);

    useEffect(() => {
        apiGet<RiwayatData>("/kurir/riwayat").then((res) => {
            if (res.success && res.data) setData(res.data);
        });
    }, []);

    if (!data) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader title="Riwayat Pengiriman" description="Riwayat pengiriman yang telah selesai" />

            <div className="grid grid-cols-2 gap-4">
                <StatsCard title="Total Pengiriman" value={data.totalPengiriman} icon="Truck" />
                <StatsCard title="Total Pendapatan" value={formatRupiah(data.totalPendapatan)} icon="Wallet" />
            </div>

            <div className="space-y-3">
                {data.riwayat.map((r) => (
                    <Card key={r.id} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{r.items}</p>
                                    <p className="text-xs text-foreground/40">Pembeli: {r.pembeli}</p>
                                    <p className="text-[10px] text-foreground/30">{new Date(r.updatedAt).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-primary">{formatRupiah(r.ongkosKirim)}</p>
                                {r.estimasiJarak && <p className="text-[10px] text-foreground/40">{r.estimasiJarak} km</p>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {data.riwayat.length === 0 && <p className="text-center py-8 text-foreground/40">Belum ada pengiriman selesai</p>}
            </div>
        </div>
    );
}
