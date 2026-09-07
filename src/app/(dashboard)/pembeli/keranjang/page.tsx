"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, MapPin, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import EmptyState from "@/components/shared/EmptyState";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah, cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function KeranjangPage() {
    const router = useRouter();
    const { items, getTotalHarga, getTotalItems, updateQuantity, removeItem, clearCart } = useCartStore();
    const [alamat, setAlamat] = useState("Jl. Ir. H. Juanda No. 120, Bandung, Jawa Barat");
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (items.length === 0 || isCheckingOut) return;
        setIsCheckingOut(true);

        try {
            const res = await fetch("/api/pembeli/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    alamatPengiriman: alamat,
                    ongkosKirim: 0,
                    metodeJual: "LANGSUNG",
                }),
            });

            const json = await res.json();
            if (json.success && json.data) {
                toast.success("Pesanan berhasil dikonfirmasi!");
                clearCart();
                router.push(`/pembeli/tracking?id=${json.data.id}`);
            } else {
                toast.error(json.message || "Gagal membuat pesanan");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            toast.error("Terjadi kendala koneksi saat checkout.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Keranjang Belanja"
                description={`${getTotalItems()} item siap untuk diproses`}
            />

            {items.length === 0 ? (
                <EmptyState
                    icon="ShoppingCart"
                    title="Keranjang masih kosong"
                    description="Sepertinya Anda belum memilih bahan pangan segar. Ayo jelajahi katalog kami!"
                    actionLabel="Mulai Belanja"
                    onAction={() => router.push("/pembeli/katalog")}
                />
            ) : (
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

                        {/* Alamat Pengiriman */}
                        <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm">
                            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>Alamat Pengiriman</span>
                            </div>
                            <input
                                type="text"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Masukkan alamat lengkap penerimaan barang..."
                                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <p className="text-[11px] text-foreground/40 font-medium">
                                Pengiriman akan diantarkan langsung oleh kurir ke titik alamat ini.
                            </p>
                        </div>

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
                                    disabled={isCheckingOut || items.length === 0}
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            MEMPROSES PESANAN...
                                        </>
                                    ) : (
                                        <>
                                            LANJUT CHECKOUT
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4" />
                                    Transaksi Aman & Terenkripsi
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}