"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Filter, Package } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { InventoryItem, Produk } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState({ produkId: "", stok: 0, minStok: 10, hargaJual: 0 });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Product list for the form dropdown
    const [produkList, setProdukList] = useState<Produk[]>([]);
    const [produkLoading, setProdukLoading] = useState(false);

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            const res = await apiGet<InventoryItem[]>(`/mitra-toko/inventory?${params.toString()}`);
            if (res.success && res.data) {
                setInventory(res.data);
            } else {
                setError(res.message || "Gagal mengambil data");
            }
        } catch {
            setError("Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const fetchProdukList = async () => {
        setProdukLoading(true);
        try {
            const res = await apiGet<Produk[]>("/produk?limit=100");
            if (res.success && res.data) {
                setProdukList(res.data);
            }
        } catch {
            // silently fail
        } finally {
            setProdukLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ produkId: "", stok: 0, minStok: 10, hargaJual: 0 });
        setFormError("");
        fetchProdukList();
        setIsModalOpen(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setEditingItem(item);
        setFormData({
            produkId: item.produkId,
            stok: item.stok,
            minStok: item.minStok,
            hargaJual: item.hargaJual,
        });
        setFormError("");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        setFormError("");
        if (!formData.produkId && !editingItem) {
            setFormError("Produk wajib dipilih");
            return;
        }
        if (formData.hargaJual <= 0) {
            setFormError("Harga jual harus lebih dari 0");
            return;
        }

        setSubmitting(true);
        try {
            if (editingItem) {
                const res = await apiPatch<InventoryItem>(`/mitra-toko/inventory/${editingItem.id}`, formData);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchInventory();
                } else {
                    setFormError(res.message || "Gagal memperbarui item");
                }
            } else {
                const res = await apiPost<InventoryItem>("/mitra-toko/inventory", formData);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchInventory();
                } else {
                    setFormError(res.message || "Gagal menambah item");
                }
            }
        } catch {
            setFormError("Gagal terhubung ke server");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus item ini dari inventori?")) return;
        try {
            const res = await apiDelete<null>(`/mitra-toko/inventory/${id}`);
            if (res.success) {
                fetchInventory();
            }
        } catch {
            // silently fail
        }
    };

    const getStatusBadge = (item: InventoryItem) => {
        if (item.stok === 0) return <Badge variant="danger">Habis</Badge>;
        if (item.stok < item.minStok) return <Badge variant="warning">Stok Rendah</Badge>;
        return <Badge variant="success">Tersedia</Badge>;
    };

    const totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);
    const paginatedItems = inventory.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6 animate-in">
            <PageHeader
                title="Inventori"
                description="Kelola stok produk di toko Anda secara real-time"
                action={
                    <Button onClick={openAddModal} className="font-bold shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Button>
                }
            />

            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Cari nama produk atau kategori..."
                        onSearch={(q) => { setSearch(q); setPage(1); }}
                    />
                </div>
                <Button variant="outline" className="h-10 border-border bg-card text-foreground">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : inventory.length === 0 ? (
                <EmptyState
                    icon="Search"
                    title="Inventori kosong"
                    description={search ? "Tidak ada produk yang cocok dengan pencarian" : "Tambahkan produk untuk mulai mengelola stok toko Anda."}
                    actionLabel={search ? undefined : "Tambah Produk"}
                    onAction={search ? undefined : openAddModal}
                />
            ) : (
                <>
                    <Card className="overflow-hidden border-border shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-foreground/5 text-foreground/70 uppercase text-[10px] font-bold tracking-widest border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Produk</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Harga Jual</th>
                                        <th className="px-6 py-4 text-center">Stok</th>
                                        <th className="px-6 py-4 text-center">Min Stok</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {paginatedItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-foreground/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.produk?.fotoUrl && (
                                                        <img
                                                            src={item.produk.fotoUrl}
                                                            alt={item.produk.nama}
                                                            className="h-8 w-8 rounded-md object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-foreground">{item.produk?.nama || "—"}</p>
                                                        <p className="text-[10px] text-foreground/40 italic">{item.produk?.satuan || ""}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary uppercase">
                                                    {item.produk?.kategori || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                Rp {item.hargaJual.toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "font-bold",
                                                    item.stok === 0 && "text-red-500",
                                                    item.stok > 0 && item.stok < item.minStok && "text-amber-500",
                                                    item.stok >= item.minStok && "text-foreground"
                                                )}>
                                                    {item.stok}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-foreground/60">
                                                {item.minStok}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(item)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 text-foreground/40 hover:text-primary transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
                                                    >
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 text-xs text-foreground/50">
                            <p>Menampilkan halaman {page} dari {totalPages} ({inventory.length} produk)</p>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                    Sebelumnya
                                </Button>
                                <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Item Inventori" : "Tambah Produk ke Inventori"}
            >
                <div className="space-y-4">
                    {!editingItem && (
                        <div>
                            <label className="mb-1.5 block text-sm font-bold text-foreground">Produk</label>
                            {produkLoading ? (
                                <p className="text-xs text-foreground/50">Memuat daftar produk...</p>
                            ) : (
                                <Select
                                    value={formData.produkId}
                                    onValueChange={(val) => setFormData({ ...formData, produkId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih produk">
                                            {formData.produkId
                                                ? produkList.find((p) => p.id === formData.produkId)?.nama
                                                : "Pilih produk"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {produkList.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.nama} — {p.kategori} ({p.satuan})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    <Input
                        label="Harga Jual (Rp)"
                        type="number"
                        value={formData.hargaJual}
                        onChange={(e) => setFormData({ ...formData, hargaJual: Number(e.target.value) })}
                        placeholder="Masukkan harga jual"
                    />

                    <Input
                        label="Stok"
                        type="number"
                        value={formData.stok}
                        onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
                        placeholder="Jumlah stok saat ini"
                    />

                    <Input
                        label="Minimum Stok (untuk alert restock)"
                        type="number"
                        value={formData.minStok}
                        onChange={(e) => setFormData({ ...formData, minStok: Number(e.target.value) })}
                        placeholder="Batas minimum stok"
                    />

                    {formError && (
                        <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">{formError}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambah"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
