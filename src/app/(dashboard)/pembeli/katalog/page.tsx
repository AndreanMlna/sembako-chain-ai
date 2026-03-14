"use client";

import { useState } from "react";
import { Filter, MapPin, Star, ShoppingCart, Info } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const PRODUCT_LIST = [
    { id: 1, name: "Beras Pandan Wangi", category: "Sembako", price: 14500, unit: "kg", seller: "Petani Ahmad", dist: "1.2 km", rating: 4.8, stock: 150 },
    { id: 2, name: "Telur Ayam Negeri", category: "Protein", price: 26000, unit: "kg", seller: "Peternakan Berkah", dist: "2.5 km", rating: 4.9, stock: 45 },
    { id: 3, name: "Minyak Goreng Sawit", category: "Minyak", price: 17500, unit: "L", seller: "Mitra Toko Jaya", dist: "0.8 km", rating: 4.5, stock: 20 },
    { id: 4, name: "Cabai Merah Keriting", category: "Sayuran", price: 45000, unit: "kg", seller: "Kelompok Tani 05", dist: "3.1 km", rating: 4.7, stock: 12 },
    { id: 5, name: "Gula Pasir Kristal", category: "Sembako", price: 16000, unit: "kg", seller: "Mitra Toko Jaya", dist: "0.8 km", rating: 4.6, stock: 80 },
    { id: 6, name: "Daging Sapi Segar", category: "Protein", price: 120000, unit: "kg", seller: "RPH Slawi", dist: "5.4 km", rating: 4.9, stock: 5 },
];

export default function KatalogPage() {
    const [products] = useState(PRODUCT_LIST);

    const kategoriOptions = [
        { value: "", label: "Semua Kategori" },
        ...KATEGORI_KOMODITAS.map((k) => ({ value: k, label: k })),
    ];

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
                        onSearch={(q) => console.log("Search:", q)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-40 sm:w-48">
                        <Select options={kategoriOptions} placeholder="Kategori" />
                    </div>
                    <Button variant="outline" className="border-border bg-card shadow-sm h-11 px-3">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-foreground/70 font-medium">
                    Menampilkan produk di area <span className="text-primary font-bold">Slawi, Tegal</span>. Harga sudah termasuk estimasi subsidi distribusi AI.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="aspect-square relative bg-foreground/5 flex items-center justify-center overflow-hidden">
                            <div className="text-foreground/10 group-hover:scale-110 transition-transform duration-500">
                                <ShoppingCart className="h-16 w-16" />
                            </div>
                            <div className="absolute top-2 left-2">
                                {/* FIX DI SINI */}
                                <Badge variant="default" className="bg-background/80 backdrop-blur-md text-[9px] font-black uppercase tracking-tighter border-none text-foreground">
                                    {product.category}
                                </Badge>
                            </div>
                            <div className="absolute bottom-2 right-2">
                                <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-[10px] font-black text-foreground">{product.rating}</span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-3">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{product.name}</h4>
                            </div>
                            <p className="text-[10px] font-medium text-foreground/40 mb-2 truncate">Oleh: {product.seller}</p>

                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-sm font-black text-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                                <span className="text-[10px] text-foreground/40 font-medium">/{product.unit}</span>
                            </div>

                            <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                                <div className="flex items-center gap-1 text-foreground/50">
                                    <MapPin className="h-3 w-3" />
                                    <span className="text-[10px] font-bold">{product.dist}</span>
                                </div>
                                <Button size="sm" className="h-8 px-2 text-[10px] font-black shadow-lg shadow-primary/10">
                                    + KERANJANG
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
        </div>
    );
}