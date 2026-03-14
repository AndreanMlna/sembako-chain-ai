"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter, ArrowUpDown } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Dummy Data Produk
const INITIAL_INVENTORY = [
    { id: 1, name: "Beras Rojolele 5kg", category: "Sembako", price: 75000, stock: 12, unit: "Karung", status: "Tersedia" },
    { id: 2, name: "Minyak Goreng 2L", category: "Minyak", price: 34000, stock: 5, unit: "Botol", status: "Stok Rendah" },
    { id: 3, name: "Gula Pasir 1kg", category: "Sembako", price: 16000, stock: 0, unit: "Pcs", status: "Habis" },
    { id: 4, name: "Telur Ayam", category: "Protein", price: 28000, stock: 50, unit: "Kg", status: "Tersedia" },
];

export default function InventoryPage() {
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Tersedia": return <Badge variant="success">{status}</Badge>;
            case "Stok Rendah": return <Badge variant="warning">{status}</Badge>;
            case "Habis": return <Badge variant="danger">{status}</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
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
                        onSearch={(q) => console.log("Search:", q)}
                    />
                </div>
                <Button variant="outline" className="h-10 border-border bg-card text-foreground">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </div>

            {inventory.length > 0 ? (
                <Card className="overflow-hidden border-border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-foreground/5 text-foreground/70 uppercase text-[10px] font-bold tracking-widest border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Produk</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4 text-center">Stok</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-foreground/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-foreground">{item.name}</p>
                                        <p className="text-[10px] text-foreground/40 italic">ID: PRD-{item.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary uppercase">
                        {item.category}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-foreground">
                                        Rp {item.price.toLocaleString("id-ID")}
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
                    description="Tambahkan produk untuk mulai mengelola stok toko Anda."
                    actionLabel="Tambah Produk"
                    onAction={() => console.log("Add product")}
                />
            )}

            {/* Mobile Pagination Info */}
            <div className="flex items-center justify-between px-2 text-xs text-foreground/50">
                <p>Menampilkan {inventory.length} produk</p>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled>Sblmnya</Button>
                    <Button variant="ghost" size="sm">Berikutnya</Button>
                </div>
            </div>
        </div>
    );
}