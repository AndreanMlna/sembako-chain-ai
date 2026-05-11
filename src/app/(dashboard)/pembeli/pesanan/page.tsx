"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle2, Clock, ShoppingBag, ChevronRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface OrderItem {
    id: string;
    produkId: string;
    nama: string;
    satuan: string;
    kategori: string;
    jumlah: number;
    harga: number;
    subtotal: number;
}

interface TrackingStep {
    label: string;
    done: boolean;
    date: string | null;
}

interface OrderData {
    id: string;
    status: string;
    totalHarga: number;
    ongkosKirim: number;
    alamatPengiriman: string;
    metodeJual: string;
    createdAt: string;
    items: OrderItem[];
    tracking: TrackingStep[];
    kurir: { nama: string; telepon: string } | null;
    estimasiWaktu: number | null;
}

export default function PesananPage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await apiGet<OrderData[]>("/pembeli/orders?limit=50");
            if (res.success && res.data) setOrders(res.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const openDetail = async (orderId: string) => {
        setDetailLoading(true);
        try {
            const res = await apiGet<OrderData>(`/pembeli/orders/${orderId}`);
            if (res.success && res.data) setSelectedOrder(res.data);
        } catch {
            // silently fail
        } finally {
            setDetailLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return <Badge variant="success">Selesai</Badge>;
            case "IN_TRANSIT":
                return <Badge variant="warning">Dikirim</Badge>;
            case "PICKED_UP":
                return <Badge variant="info">Dijemput</Badge>;
            case "CONFIRMED":
                return <Badge variant="info">Diproses</Badge>;
            case "CANCELLED":
                return <Badge variant="danger">Dibatalkan</Badge>;
            default:
                return <Badge variant="default">Pending</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "IN_TRANSIT":
                return <Truck className="h-5 w-5 text-yellow-500" />;
            case "PICKED_UP":
            case "CONFIRMED":
                return <Clock className="h-5 w-5 text-blue-500" />;
            default:
                return <Package className="h-5 w-5 text-foreground/40" />;
        }
    };

    const statusLabels: Record<string, string> = {
        PENDING: "Pending",
        CONFIRMED: "Diproses",
        PICKED_UP: "Dijemput",
        IN_TRANSIT: "Dikirim",
        DELIVERED: "Selesai",
        CANCELLED: "Dibatalkan",
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Pesanan Saya"
                description="Pantau status pengiriman dan riwayat belanja Anda"
            />

            {orders.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((order) => (
                            <Card
                                key={order.id}
                                className="group border-border bg-card hover:border-primary/50 transition-all overflow-hidden shadow-sm"
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                                        <div className="flex items-center gap-4 md:w-1/4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/5">
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest leading-none mb-1">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </p>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider leading-none">
                                                {order.items?.map((i) => i.nama).join(", ") || "—"}
                                            </p>
                                            <h4 className="text-sm font-bold text-foreground line-clamp-1">
                                                {order.alamatPengiriman || "Alamat tidak tersedia"}
                                            </h4>
                                            <p className="text-[10px] text-foreground/40 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center md:w-1/4 gap-2 border-t border-border pt-4 md:border-none md:pt-0">
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Total</p>
                                                <p className="text-lg font-black text-primary tracking-tighter">
                                                    {formatRupiah(order.totalHarga)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[10px] font-black border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all"
                                                onClick={() => openDetail(order.id)}
                                                disabled={detailLoading}
                                            >
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
                    Punya kendala dengan pesanan?{" "}
                    <span className="text-primary font-bold cursor-pointer hover:underline">Tanya AI Assistant</span>{" "}
                    kami untuk bantuan instan.
                </p>
            </div>

            {/* ORDER DETAIL MODAL */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={selectedOrder ? `Pesanan #${selectedOrder.id.slice(-8).toUpperCase()}` : ""}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        {/* Status */}
                        <div className="flex items-center justify-between">
                            {getStatusBadge(selectedOrder.status)}
                            <span className="text-xs text-foreground/50">
                                {new Date(selectedOrder.createdAt).toLocaleDateString("id-ID")}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="border-y border-border py-3 space-y-2">
                            {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-foreground/70">
                                        {item.nama} ({item.satuan}) x{item.jumlah}
                                    </span>
                                    <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tracking */}
                        {selectedOrder.tracking && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-foreground">Tracking</h4>
                                <div className="relative pl-6 space-y-4">
                                    {selectedOrder.tracking.map((step, i) => (
                                        <div key={i} className="relative">
                                            <div
                                                className={cn(
                                                    "absolute -left-6 mt-0.5 h-4 w-4 rounded-full border-2",
                                                    step.done
                                                        ? "border-green-500 bg-green-500"
                                                        : "border-foreground/20 bg-transparent"
                                                )}
                                            >
                                                {step.done && (
                                                    <CheckCircle2 className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                )}
                                            </div>
                                            <p
                                                className={cn(
                                                    "text-sm",
                                                    step.done ? "text-foreground font-bold" : "text-foreground/40"
                                                )}
                                            >
                                                {step.label}
                                            </p>
                                            {step.date && (
                                                <p className="text-[10px] text-foreground/40">
                                                    {new Date(step.date).toLocaleString("id-ID")}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kurir info */}
                        {selectedOrder.kurir && (
                            <div className="rounded-lg bg-foreground/5 p-3 text-sm">
                                <p className="font-bold">Kurir: {selectedOrder.kurir.nama}</p>
                                {selectedOrder.estimasiWaktu && (
                                    <p className="text-foreground/50">
                                        Estimasi tiba: {selectedOrder.estimasiWaktu} menit
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Totals */}
                        <div className="space-y-1 text-sm pt-2 border-t border-border">
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Ongkos Kirim</span>
                                <span>{formatRupiah(selectedOrder.ongkosKirim)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black">
                                <span>Total</span>
                                <span className="text-primary">{formatRupiah(selectedOrder.totalHarga)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
