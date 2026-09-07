"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Filter, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn, formatRupiah } from "@/lib/utils";
import { getInventory } from "@/services/mitra-toko.service";

interface InventoryRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: "Tersedia" | "Stok Rendah" | "Habis";
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getInventory();
        if (res.success && res.data) {
          const mapped: InventoryRow[] = res.data.map((item: any) => {
            const status: "Tersedia" | "Stok Rendah" | "Habis" =
              item.stok <= 0 ? "Habis" : item.stok <= item.minStok ? "Stok Rendah" : "Tersedia";

            return {
              id: item.id,
              name: item.produk?.nama || "Produk",
              category: item.produk?.kategori || "Sembako",
              price: item.hargaJual || 0,
              stock: item.stok || 0,
              unit: item.produk?.satuan || "kg",
              status,
            };
          });
          setInventory(mapped);
        }
      } catch (err) {
        console.error("Gagal mengambil inventori toko:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return <Badge variant="success">{status}</Badge>;
      case "Stok Rendah":
        return <Badge variant="warning">{status}</Badge>;
      case "Habis":
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Inventori"
        description="Kelola stok produk di toko Anda secara real-time"
        action={
          <Button className="font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari nama produk atau kategori..."
            onSearch={(q) => setSearchQuery(q)}
          />
        </div>
        <Button variant="outline" className="h-10 border-border bg-card text-foreground">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredInventory.length > 0 ? (
        <Card className="overflow-hidden border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-foreground/5 text-foreground/70 uppercase text-[10px] font-bold tracking-widest border-b border-border">
                <tr>
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga Jual</th>
                  <th className="px-6 py-4 text-center">Stok</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-foreground/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-[10px] text-foreground/40 italic">ID: {item.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "font-bold",
                        item.stock <= 5 ? "text-red-500" : "text-foreground"
                      )}>
                        {item.stock}
                      </span>
                      <span className="ml-1 text-[10px] text-foreground/50 uppercase">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-foreground/40 hover:text-primary transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-foreground/40 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="Package"
          title="Inventori kosong"
          description={
            searchQuery
              ? `Tidak ditemukan produk dengan kata kunci "${searchQuery}".`
              : "Belum ada item di inventori toko Anda. Tambahkan produk untuk mulai mengelola stok."
          }
          actionLabel="Tambah Produk"
          onAction={() => console.log("Add product")}
        />
      )}

      {/* Mobile Pagination Info */}
      <div className="flex items-center justify-between px-2 text-xs text-foreground/50">
        <p>Menampilkan {filteredInventory.length} produk</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled>Sblmnya</Button>
          <Button variant="ghost" size="sm" disabled={filteredInventory.length < 10}>Berikutnya</Button>
        </div>
      </div>
    </div>
  );
}