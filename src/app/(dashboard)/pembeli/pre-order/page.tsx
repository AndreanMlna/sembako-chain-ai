"use client";

import { useState, useEffect } from "react";
import { Sprout, Timer, ArrowRight, MapPin, CalendarClock } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import { apiGet, apiPost } from "@/lib/api";

interface PreOrderItem {
    id: string; nama: string; varietas: string; statusPanen: string;
    estimasiPanen: string; hariKePanen: number; progress: number;
    petani: { id: string; nama: string; latitude: number | null; longitude: number | null };
    lahan: { id: string; nama: string };
}

export default function PreOrderPage() {
    const [items, setItems] = useState<PreOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            const res = await apiGet<PreOrderItem[]>("/pembeli/pre-order");
            if (res.success && res.data) setItems(res.data);
        } catch { /* silent */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handlePreOrder = async (tanamanId: string) => {
        setOrdering(tanamanId);
        await apiPost("/pembeli/pre-order", { tanamanId, jumlah: 1 });
        setOrdering(null);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader title="Pre-Order Panen" description="Pesan hasil panen lebih awal untuk jaminan stok dan harga petani langsung" />

            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3 items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <Timer className="h-5 w-5" />
                </div>
                <p className="text-xs text-foreground/70">Pantau tanaman yang sedang tumbuh dan akan segera dipanen. Pre-order untuk mengamankan stok.</p>
            </div>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {items.map((item) => (
                        <Card key={item.id} className="group border-border bg-card hover:border-primary/50 transition-all overflow-hidden shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Sprout className="h-4 w-4 text-primary" />
                                                <span className="text-[10px] font-black text-primary uppercase">{item.varietas}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">{item.nama}</h3>
                                            <p className="text-xs text-foreground/40 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {item.petani.nama} — {item.lahan.nama}
                                            </p>
                                        </div>
                                        <Badge variant={item.statusPanen === "SIAP_PANEN" ? "success" : "info"}>
                                            {item.statusPanen === "SIAP_PANEN" ? "Siap Panen" : "Tumbuh"}
                                        </Badge>
                                    </div>

                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-[11px] font-bold text-foreground/50 uppercase">Estimasi Panen:</p>
                                            <p className="text-sm font-black text-foreground">
                                                {new Date(item.estimasiPanen).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                        <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                                        </div>
                                        <p className="text-[10px] font-medium text-foreground/40 text-right">
                                            {item.hariKePanen > 0 ? `${item.hariKePanen} hari lagi` : "Sudah siap panen!"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border pt-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-foreground/30 uppercase mb-1">Status</p>
                                            <p className="text-sm font-black text-foreground">{item.progress}% Pertumbuhan</p>
                                        </div>
                                        <Button
                                            className="font-black px-6 shadow-lg shadow-primary/20"
                                            onClick={() => handlePreOrder(item.id)}
                                            disabled={ordering === item.id}
                                        >
                                            {ordering === item.id ? "..." : "PESAN"}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState icon="CalendarClock" title="Belum ada pre-order tersedia" description="Pre-order akan muncul saat petani memiliki tanaman yang sedang tumbuh." />
            )}
        </div>
    );
}
