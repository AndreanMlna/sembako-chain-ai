"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, Search, ChevronRight, ShoppingBag } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 1. DEFINISIKAN TIPE VARIANT BADGE AGAR TIDAK PAKAI 'ANY'
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface Order {
    id: string;
    date: string;
    store: string;
    items: string;
    total: number;
    status: string;
    color: BadgeVariant; // Pakai tipe spesifik di sini
}

const ORDER_HISTORY: Order[] = [
    {
        id: "ORD-7721",
        date: "14 Mar 2026",
        store: "Tani Makmur Group",
        items: "Beras Pandan Wangi, Telur Ayam",
        total: 215000,
        status: "Dikirim",
        color: "warning"
    },
    {
        id: "ORD-7715",
        date: "12 Mar 2026",
        store: "Mitra Toko Slawi",
        items: "Minyak Goreng, Gula Pasir",
        total: 150000,
        status: "Selesai",
        color: "success"
    },
    {
        id: "ORD-7710",
        date: "10 Mar 2026",
        store: "Peternakan Berkah",
        items: "Daging Sapi Segar",
        total: 120000,
        status: "Diproses",
        color: "info"
    }
];

export default function PesananPage() {
    const [orders] = useState<Order[]>(ORDER_HISTORY);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Selesai": return <CheckCircle2 className="h-5 w-5 text-primary" />;
            case "Dikirim": return <Truck className="h-5 w-5 text-yellow-500" />;
            case "Diproses": return <Clock className="h-5 w-5 text-blue-500" />;
            default: return <Package className="h-5 w-5 text-foreground/40" />;
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Pesanan Saya"
                description="Pantau status pengiriman dan riwayat belanja Anda"
            />

            {orders.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {["Semua", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((tab, i) => (
                            <Badge
                                key={tab}
                                variant={i === 0 ? "default" : "info"}
                                className={cn(
                                    "cursor-pointer px-4 py-1.5 text-[11px] font-bold border-none",
                                    i === 0 ? "bg-primary text-white" : "bg-foreground/5 text-foreground/50"
                                )}
                            >
                                {tab}
                            </Badge>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="group border-border bg-card hover:border-primary/50 transition-all overflow-hidden shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                                        <div className="flex items-center gap-4 md:w-1/4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/5">
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest leading-none mb-1">
                                                    {order.id}
                                                </p>
                                                {/* SEKARANG SUDAH AMAN TANPA 'ANY' */}
                                                <Badge variant={order.color} className="text-[9px] h-4 font-black uppercase">
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider leading-none">
                                                {order.store}
                                            </p>
                                            <h4 className="text-sm font-bold text-foreground line-clamp-1">
                                                {order.items}
                                            </h4>
                                            <p className="text-[10px] text-foreground/40 font-medium">
                                                Dipesan pada {order.date}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center md:w-1/4 gap-2 border-t border-border pt-4 md:border-none md:pt-0">
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Total Bayar</p>
                                                <p className="text-lg font-black text-primary tracking-tighter">
                                                    Rp {order.total.toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                DETAIL
                                                <ChevronRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon="Package"
                    title="Belum ada pesanan"
                    description="Pesanan Anda akan muncul di sini setelah melakukan pembelian dari Katalog Produk."
                    actionLabel="Mulai Belanja"
                    onAction={() => window.location.href = "/pembeli/katalog"}
                />
            )}

            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3 items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <ShoppingBag className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                    Punya kendala dengan pesanan? <span className="text-primary font-bold cursor-pointer hover:underline">Tanya AI Assistant</span> kami untuk bantuan instan 24/7.
                </p>
            </div>
        </div>
    );
}