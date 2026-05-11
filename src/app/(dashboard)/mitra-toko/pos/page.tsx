"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Trash2, CreditCard, Search, Tag, CheckCircle, Receipt } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn, formatRupiah } from "@/lib/utils";
import { apiGet, apiPost } from "@/lib/api";

interface POSProduct {
    id: string;
    produkId: string;
    nama: string;
    kategori: string;
    satuan: string;
    fotoUrl: string | null;
    stok: number;
    hargaJual: number;
}

interface CartItem {
    inventoryItemId: string;
    nama: string;
    hargaJual: number;
    qty: number;
}

interface ReceiptData {
    transaksiId: string;
    referensi: string;
    items: { nama: string; quantity: number; hargaSatuan: number; subtotal: number }[];
    total: number;
    waktu: string;
}

export default function POSPage() {
    const [products, setProducts] = useState<POSProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState("");
    const [processing, setProcessing] = useState(false);
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);

    const fetchProducts = useCallback(async () => {
        const params = search ? `?search=${encodeURIComponent(search)}` : "";
        try {
            const res = await apiGet<POSProduct[]>(`/mitra-toko/pos/products${params}`);
            if (res.success && res.data) setProducts(res.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        setLoading(true);
        fetchProducts();
    }, [fetchProducts]);

    const addToCart = (product: POSProduct) => {
        if (product.stok <= 0) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.inventoryItemId === product.id);
            if (existing) {
                if (existing.qty >= product.stok) return prev;
                return prev.map((item) =>
                    item.inventoryItemId === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    inventoryItemId: product.id,
                    nama: product.nama,
                    hargaJual: product.hargaJual,
                    qty: 1,
                },
            ];
        });
    };

    const updateQty = (inventoryItemId: string, delta: number) => {
        setCart((prev) => {
            const product = products.find((p) => p.id === inventoryItemId);
            const maxQty = product?.stok ?? 99;
            return prev.map((item) => {
                if (item.inventoryItemId !== inventoryItemId) return item;
                const newQty = Math.max(1, Math.min(item.qty + delta, maxQty));
                return { ...item, qty: newQty };
            });
        });
    };

    const removeFromCart = (inventoryItemId: string) => {
        setCart((prev) => prev.filter((item) => item.inventoryItemId !== inventoryItemId));
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || processing) return;
        setProcessing(true);
        try {
            const res = await apiPost<ReceiptData>("/mitra-toko/pos/transactions", {
                items: cart.map((item) => ({
                    inventoryItemId: item.inventoryItemId,
                    quantity: item.qty,
                })),
            });
            if (res.success && res.data) {
                setReceipt(res.data);
                setCart([]);
                fetchProducts(); // Refresh stock
            }
        } catch {
            // silently fail
        } finally {
            setProcessing(false);
        }
    };

    const total = cart.reduce((acc, item) => acc + item.hargaJual * item.qty, 0);

    const getProductStock = (productId: string) => {
        const product = products.find((p) => p.id === productId);
        return product?.stok ?? 0;
    };

    const getCartQty = (inventoryItemId: string) => {
        const item = cart.find((i) => i.inventoryItemId === inventoryItemId);
        return item?.qty ?? 0;
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Point of Sale (POS)"
                description="Kasir untuk transaksi di toko"
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT: PRODUCT SELECTION */}
                <div className="lg:col-span-2 space-y-4">
                    <SearchBar
                        placeholder="Cari nama produk atau kategori..."
                        onSearch={(q) => setSearch(q)}
                    />

                    {loading ? (
                        <LoadingSpinner />
                    ) : products.length === 0 ? (
                        <div className="text-center py-16 text-foreground/40">
                            <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-30" />
                            <p className="font-medium">
                                {search ? "Tidak ada produk yang cocok" : "Belum ada produk di inventori"}
                            </p>
                            <p className="text-sm mt-1">
                                {search ? "" : "Tambahkan produk di halaman Inventori terlebih dahulu."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {products.map((product) => {
                                const inCartQty = getCartQty(product.id);
                                const isMaxed = inCartQty >= product.stok;
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => !isMaxed && addToCart(product)}
                                        className={cn(
                                            "rounded-xl border border-border bg-card overflow-hidden transition-all",
                                            isMaxed
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-95"
                                        )}
                                    >
                                        <div className="aspect-video bg-primary/5 flex items-center justify-center">
                                            <Tag className="h-8 w-8 text-primary/30" />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                                {product.kategori}
                                            </p>
                                            <h4 className="text-sm font-bold text-foreground leading-tight mt-1">
                                                {product.nama}
                                            </h4>
                                            <p className="mt-2 text-base font-extrabold text-foreground">
                                                {formatRupiah(product.hargaJual)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[10px] text-foreground/40 font-medium">
                                                    Stok: {product.stok} {product.satuan}
                                                </p>
                                                {inCartQty > 0 && (
                                                    <Badge variant="success">
                                                        {inCartQty} di keranjang
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* RIGHT: CART / CHECKOUT */}
                <div className="relative">
                    <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 h-fit overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Keranjang</h3>
                                {cart.length > 0 && (
                                    <Badge variant="info">{cart.length}</Badge>
                                )}
                            </div>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                {cart.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-foreground/40 italic">
                                        Klik produk untuk menambah ke keranjang.
                                    </p>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.inventoryItemId}
                                            className="flex flex-col gap-2 border-b border-border/50 pb-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-foreground leading-tight w-2/3">
                                                    {item.nama}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.inventoryItemId)}
                                                    className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQty(item.inventoryItemId, -1)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.inventoryItemId, 1)}
                                                        disabled={item.qty >= getProductStock(item.inventoryItemId)}
                                                        className={cn(
                                                            "h-8 w-8 flex items-center justify-center rounded-lg transition-colors font-bold",
                                                            item.qty >= getProductStock(item.inventoryItemId)
                                                                ? "bg-foreground/5 text-foreground/30 cursor-not-allowed"
                                                                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                                                        )}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-foreground">
                                                    {formatRupiah(item.hargaJual * item.qty)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* TOTAL & PAY */}
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                                    <span className="text-sm font-medium text-foreground/60">Total</span>
                                    <span className="text-sm font-bold text-foreground">{formatRupiah(total)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xl font-black text-foreground">
                                    <span>Grand Total</span>
                                    <span className="text-primary tracking-tighter">{formatRupiah(total)}</span>
                                </div>

                                <Button
                                    className="w-full py-7 text-lg font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                                    disabled={cart.length === 0 || processing}
                                    onClick={handleCheckout}
                                >
                                    {processing ? (
                                        "Memproses..."
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-6 w-6" />
                                            BAYAR SEKARANG
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* RECEIPT MODAL */}
            <Modal
                isOpen={!!receipt}
                onClose={() => setReceipt(null)}
                title="Transaksi Berhasil"
            >
                {receipt && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="font-bold text-foreground">Pembayaran Sukses</p>
                                <p className="text-xs text-foreground/50">Ref: {receipt.referensi}</p>
                            </div>
                        </div>

                        <div className="border-y border-border py-3 space-y-2">
                            {receipt.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-foreground/70">
                                        {item.nama} x{item.quantity}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between text-lg font-black">
                            <span>Total</span>
                            <span className="text-primary">{formatRupiah(receipt.total)}</span>
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => setReceipt(null)}
                        >
                            <Receipt className="mr-2 h-4 w-4" />
                            Selesai
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
