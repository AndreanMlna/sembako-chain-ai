"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Sprout, Timer, ArrowRight, Info, MapPin, Star, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-hot-toast";

// Definisi tipe biar TS nggak ngamuk lagi ler
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface PreOrder {
    id: string;
    name: string;
    seller: string;
    harvestDate: string;
    price: number;
    unit: string;
    slots: number;
    totalSlots: number;
    status: string;
    variant: BadgeVariant;
}

export default function PreOrderPage() {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [items, setItems] = useState<PreOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const handleOrder = (po: PreOrder) => {
        addItem({
            id: po.id,
            name: `[Pre-Order] ${po.name}`,
            price: po.price,
            unit: po.unit,
            qty: 1,
        });
        toast.success(`Pre-order ${po.name} ditambahkan ke keranjang!`);
        router.push("/pembeli/keranjang");
    };

    useEffect(() => {
        const fetchPreOrders = async () => {
            try {
                const res = await fetch("/api/pembeli/pre-order");
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setItems(json.data);
                }
            } catch (err) {
                console.error("Gagal memuat pre-order:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreOrders();
    }, []);

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Pre-Order Panen"
                description="Pesan hasil panen lebih awal untuk jaminan stok dan harga petani langsung"
            />

            {/* AI Intelligence Alert */}
            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3 items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <Timer className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">Estimasi AI Panen Tepat</p>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                        Sistem kami memantau kondisi cuaca di <span className="text-primary font-bold">Tegal & Sekitarnya</span> untuk memvalidasi tanggal panen di bawah ini.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-semibold text-foreground/50">Memuat jadwal pre-order panen dari database...</p>
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {items.map((po) => (
                        <Card key={po.id} className="group border-border bg-card hover:border-primary/50 transition-all overflow-hidden shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Sprout className="h-4 w-4 text-primary" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{po.id}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground leading-tight">{po.name}</h3>
                                            <p className="text-xs text-foreground/40 font-medium flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {po.seller}
                                            </p>
                                        </div>
                                        <Badge variant={po.variant} className="text-[10px] font-black uppercase px-2">
                                            {po.status}
                                        </Badge>
                                    </div>

                                    {/* Harvest Timeline Visual */}
                                    <div className="mb-6 space-y-2">
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">Target Panen:</p>
                                            <p className="text-sm font-black text-foreground">{po.harvestDate}</p>
                                        </div>
                                        <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-1000"
                                                style={{ width: `${(po.slots / po.totalSlots) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-medium text-foreground/40 text-right">
                                            Terisi <span className="font-bold text-primary">{po.slots}</span> dari {po.totalSlots} {po.unit}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border pt-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">Harga Pre-Order</p>
                                            <p className="text-xl font-black text-primary">
                                                Rp {po.price.toLocaleString("id-ID")} <span className="text-xs font-medium text-foreground/40">/{po.unit}</span>
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => handleOrder(po)}
                                            className="font-black px-6 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        >
                                            PESAN SEKARANG
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="CalendarClock"
                    title="Belum ada pre-order tersedia"
                    description="Pre-order akan muncul saat petani membuka jadwal tanam mereka. Pantau terus untuk mendapatkan harga terbaik!"
                />
            )}
        </div>
    );
}