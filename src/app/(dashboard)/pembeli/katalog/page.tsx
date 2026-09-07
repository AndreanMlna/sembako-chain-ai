"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, MapPin, Star, ShoppingCart, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { KATEGORI_KOMODITAS } from "@/constants";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { apiGet } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface CatalogProduct {
  id: string;
  nama: string;
  kategori: string;
  hargaPerSatuan: number;
  satuan: string;
  stokTersedia: number;
  fotoUrl?: string;
  petani?: {
    id: string;
    nama: string;
    kabupaten: string;
    provinsi: string;
  };
}

export default function KatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addItem = useCartStore((state) => state.addItem);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const totalCartPrice = useCartStore((state) => state.getTotalHarga());

  const fetchKatalog = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedKategori && selectedKategori !== "ALL") {
        params.append("kategori", selectedKategori);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await apiGet<CatalogProduct[]>(`/pembeli/katalog${queryStr}`);
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil katalog produk:", err);
      toast.error("Gagal memuat produk dari database");
    } finally {
      setLoading(false);
    }
  }, [selectedKategori, searchQuery]);

  useEffect(() => {
    fetchKatalog();
  }, [fetchKatalog]);

  const handleAddToCart = (product: CatalogProduct) => {
    addItem({
      id: product.id,
      name: product.nama,
      price: product.hargaPerSatuan,
      unit: product.satuan,
      qty: 1,
    });
    toast.success(`${product.nama} ditambahkan ke keranjang`);
  };

  return (
    <div className="space-y-6 animate-in pb-16">
      <PageHeader
        title="Katalog Produk"
        description="Beli langsung dari produsen terdekat untuk harga terbaik dan kesegaran maksimal"
        action={
          <Link href="/pembeli/keranjang">
            <Button size="sm" className="relative font-bold shadow-md shadow-primary/20">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Keranjang
              {totalCartItems > 0 && (
                <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-primary text-[10px] font-black px-1 shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari beras, telur, atau sayuran..."
            onSearch={(q) => setSearchQuery(q)}
          />
        </div>
                <div className="flex gap-2">
                    <div className="w-40 sm:w-48">
                        <Select value={selectedKategori} onValueChange={(val) => setSelectedKategori(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Kategori</SelectItem>
                                {KATEGORI_KOMODITAS.map((kategori) => (
                                    <SelectItem key={kategori} value={kategori}>
                                        {kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        className="border-border bg-card shadow-sm h-11 px-3"
                        onClick={fetchKatalog}
                        disabled={loading}
                    >
                        <Filter className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-foreground/70 font-medium">
                    Menampilkan produk pasokan lokal terverifikasi. Harga langsung dari produsen berbasis smart-supply chain AI.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-foreground/50">Mengambil katalog dari database...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div className="aspect-square relative bg-foreground/5 flex items-center justify-center overflow-hidden">
                                <div className="text-foreground/10 group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingCart className="h-16 w-16" />
                                </div>
                                <div className="absolute top-2 left-2">
                                    <Badge variant="default" className="bg-background/80 backdrop-blur-md text-[9px] font-black uppercase tracking-tighter border-none text-foreground">
                                        {product.kategori}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        <span className="text-[10px] font-black text-foreground">5.0</span>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{product.nama}</h4>
                                </div>
                                <p className="text-[10px] font-medium text-foreground/40 mb-2 truncate">
                                    Oleh: {product.petani?.nama || "Mitra Produsen"}
                                </p>

                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-sm font-black text-primary">Rp {product.hargaPerSatuan.toLocaleString("id-ID")}</span>
                                    <span className="text-[10px] text-foreground/40 font-medium">/{product.satuan}</span>
                                </div>

                                <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                                    <div className="flex items-center gap-1 text-foreground/50">
                                        <MapPin className="h-3 w-3" />
                                        <span className="text-[10px] font-bold truncate max-w-[70px]">
                                            {product.petani?.kabupaten || "Pedesaan"}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="h-8 px-2 text-[10px] font-black shadow-lg shadow-primary/10"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        + KERANJANG
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="ShoppingCart"
                    title="Produk tidak ditemukan"
                    description="Belum ada komoditas pangan yang sesuai dengan filter atau kata kunci pencarian Anda di database."
                    actionLabel="Reset Pencarian"
                    onAction={() => {
                        setSelectedKategori("");
                        setSearchQuery("");
                    }}
                />
            )}

            {!loading && products.length > 0 && (
                <div className="mt-8 flex justify-center border-t border-border pt-6">
                    <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest">
                        Menampilkan {products.length} Produk dari Database
                    </p>
                </div>
            )}

            {totalCartItems > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-2xl bg-card/95 backdrop-blur-lg border border-primary/30 p-4 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5">
                    <div>
                        <p className="text-xs font-bold text-foreground">{totalCartItems} Item di Keranjang</p>
                        <p className="text-sm font-black text-primary">Rp {totalCartPrice.toLocaleString("id-ID")}</p>
                    </div>
                    <Link href="/pembeli/keranjang">
                        <Button size="sm" className="font-bold shadow-lg shadow-primary/20">
                            Lihat Keranjang
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}