"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, CheckCircle2, Receipt } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import EmptyState from "@/components/shared/EmptyState";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah, cn } from "@/lib/utils";
import { apiPost } from "@/lib/api";

interface OrderResult {
    orderId: string;
    totalHarga: number;
    status: string;
    items: { nama: string; jumlah: number; harga: number; subtotal: number }[];
    createdAt: string;
}

export default function KeranjangPage() {
    const { items, getTotalHarga, getTotalItems, updateQuantity, removeItem, clearCart } = useCartStore();
    const [checkingOut, setCheckingOut] = useState(false);
    const [error, setError] = useState("");
    const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

    const handleCheckout = async () => {
        if (items.length === 0 || checkingOut) return;
        setCheckingOut(true);
        setError("");

        try {
            const res = await apiPost<OrderResult>("/pembeli/orders", {
                items: items.map((item) => ({
                    produkId: item.id,
                    quantity: item.qty,
                })),
            });

            if (res.success && res.data) {
                setOrderResult(res.data);
                clearCart();
            } else {
                setError(res.message || "Gagal membuat pesanan");
            }
        } catch {
            setError("Gagal terhubung ke server");
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Keranjang Belanja"
                description={`${getTotalItems()} item siap untuk diproses`}
            />

            {items.length === 0 && !orderResult ? (
                <EmptyState
                    icon="ShoppingCart"
                    title="Keranjang masih kosong"
                    description="Sepertinya Anda belum memilih bahan pangan segar. Ayo jelajahi katalog kami!"
                    actionLabel="Mulai Belanja"
                    onAction={() => window.location.href = "/pembeli/katalog"}
                />
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT: ITEMS LIST */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="border-border bg-card group overflow-hidden">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="h-20 w-20 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary/20">
                                            <ShoppingCart className="h-10 w-10" />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-base font-bold text-foreground leading-tight">{item.name}</h4>
                                                    <p className="text-xs text-foreground/40 font-medium">Satuan: {item.unit || 'kg'}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-foreground/20 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                                <p className="text-lg font-black text-primary">
                                                    {formatRupiah(item.price * item.qty)}
                                                </p>

                                                <div className="flex items-center gap-3 bg-foreground/5 w-fit rounded-lg p-1 border border-border">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-background text-foreground transition-all active:scale-90"
                                                        disabled={item.qty <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-sm font-black w-6 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-background text-foreground transition-all active:scale-90"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {error && (
                            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
                        )}

                        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex gap-3 items-start">
                            <Truck className="h-5 w-5 text-primary shrink-0" />
                            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                                Sistem AI kami sedang mencari <span className="text-primary font-bold">Kurir Terdekat</span> untuk memastikan barang sampai dalam kondisi segar hari ini.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY CARD */}
                    <div className="relative">
                        <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 bg-card">
                            <CardContent className="p-6">
                                <h3 className="mb-6 text-lg font-black text-foreground tracking-tight uppercase">
                                    Ringkasan Belanja
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/50 font-medium">Total Harga ({getTotalItems()} item)</span>
                                        <span className="font-bold text-foreground">{formatRupiah(getTotalHarga())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-border pb-4">
                                        <span className="text-foreground/50 font-medium">Ongkos Kirim</span>
                                        <Badge variant="info" className="text-[10px] h-5 bg-primary/10 text-primary border-none">
                                            FREE SUBSIDI
                                        </Badge>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex justify-between items-baseline mb-6">
                                            <span className="text-base font-bold text-foreground">Total Bayar</span>
                                            <span className="text-2xl font-black text-primary tracking-tighter">
                                                {formatRupiah(getTotalHarga())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-7 text-base font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 group"
                                    onClick={handleCheckout}
                                    disabled={checkingOut}
                                >
                                    {checkingOut ? "MEMPROSES..." : "BAYAR SEKARANG"}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4" />
                                    Transaksi Aman & Terenkripsi
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : null}

            {/* SUCCESS MODAL */}
            <Modal
                isOpen={!!orderResult}
                onClose={() => setOrderResult(null)}
                title="Pesanan Berhasil Dibuat!"
            >
                {orderResult && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="font-bold text-foreground">Pembayaran Berhasil</p>
                                <p className="text-xs text-foreground/50">Order ID: {orderResult.orderId}</p>
                            </div>
                        </div>

                        <div className="border-y border-border py-3 space-y-2">
                            {orderResult.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-foreground/70">
                                        {item.nama} x{item.jumlah}
                                    </span>
                                    <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between text-lg font-black">
                            <span>Total</span>
                            <span className="text-primary">{formatRupiah(orderResult.totalHarga)}</span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setOrderResult(null)}
                            >
                                Tutup
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    setOrderResult(null);
                                    window.location.href = "/pembeli/pesanan";
                                }}
                            >
                                <Receipt className="mr-2 h-4 w-4" />
                                Lihat Pesanan
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
