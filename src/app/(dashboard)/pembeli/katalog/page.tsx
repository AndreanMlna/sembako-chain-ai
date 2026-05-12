"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, MapPin, Star, ShoppingCart } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatRupiah } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { Produk } from "@/types";

export default function KatalogPage() {
    const [products, setProducts] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("");
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const addItem = useCartStore((s) => s.addItem);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (kategori) params.set("kategori", kategori);
            params.set("limit", "50");
            const res = await apiGet<Produk[]>(`/produk?${params.toString()}`);
            if (res.success && res.data) setProducts(res.data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [search, kategori]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddToCart = (product: Produk) => {
        addItem({
            id: product.id,
            name: product.nama,
            price: product.hargaPerSatuan,
            qty: 1,
            unit: product.satuan,
        });
        setAddedIds((prev) => new Set(prev).add(product.id));
        setTimeout(() => {
            setAddedIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Katalog Produk"
                description="Beli langsung dari produsen terdekat untuk harga terbaik dan kesegaran maksimal"
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Cari beras, telur, atau sayuran..."
                        onSearch={(q) => setSearch(q)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-40 sm:w-48">
                        <Select value={kategori} onValueChange={(v) => setKategori(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kategori">
                                    {kategori || "Semua Kategori"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Semua Kategori</SelectItem>
                                {KATEGORI_KOMODITAS.map((kat) => (
                                    <SelectItem key={kat} value={kat}>
                                        {kat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" className="border-border bg-card shadow-sm h-11 px-3">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-foreground/70 font-medium">
                    Menampilkan produk segar terdekat. Harga sudah termasuk estimasi subsidi distribusi AI.
                </p>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : products.length === 0 ? (
                <div className="text-center py-16 text-foreground/40">
                    <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-30" />
                    <p className="font-medium">
                        {search || kategori ? "Tidak ada produk yang cocok" : "Belum ada produk tersedia"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="aspect-square relative bg-foreground/5 flex items-center justify-center overflow-hidden">
                                    {product.fotoUrl ? (
                                        <img src={product.fotoUrl} alt={product.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="text-foreground/10 group-hover:scale-110 transition-transform duration-500">
                                            <ShoppingCart className="h-16 w-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-background/80 backdrop-blur-md text-[9px] font-black uppercase tracking-tighter border-none text-foreground">
                                            {product.kategori}
                                        </Badge>
                                    </div>
                                    {(product.stokTersedia ?? 0) > 0 && (
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="success" className="text-[9px]">
                                                Stok: {product.stokTersedia}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-3">
                                    <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1 mb-1">
                                        {product.nama}
                                    </h4>
                                    <p className="text-[10px] font-medium text-foreground/40 mb-2 truncate">
                                        {product.satuan}
                                    </p>

                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-sm font-black text-primary">
                                            {formatRupiah(product.hargaPerSatuan)}
                                        </span>
                                        <span className="text-[10px] text-foreground/40 font-medium">
                                            /{product.satuan}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                                        <div className="flex items-center gap-1 text-foreground/50">
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            <span className="text-[10px] font-bold">Segar</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="h-8 px-2 text-[10px] font-black shadow-lg shadow-primary/10"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={(product.stokTersedia ?? 0) <= 0}
                                        >
                                            {addedIds.has(product.id) ? "✓ DITAMBAH" : "+ KERANJANG"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center border-t border-border pt-6">
                        <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest">
                            Menampilkan {products.length} Produk Segar Terdekat
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
