"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin, Ruler, Sprout, Loader2, Trash2, Edit3, X, Check, ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getLahanList, deleteLahan } from "@/services/petani.service";
import type { Lahan } from "@/types";
import { toast } from "react-hot-toast";

interface ExtendedLahan extends Omit<Lahan, 'lokasi'> {
    kecamatan?: string;
    kabupaten?: string;
    lokasi: {
        jalan?: string;
        kelurahan?: string;
        kecamatan?: string;
        kabupaten?: string;
        provinsi?: string;
        kodePos?: string;
        latitude?: number;
        longitude?: number;
    };
}

interface LahanResponse {
    lahan?: ExtendedLahan[];
    data?: ExtendedLahan[];
}

export default function LahanPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [dataLahan, setDataLahan] = useState<ExtendedLahan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchLahan = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getLahanList();
            if (response.success && response.data) {
                let finalData: ExtendedLahan[] = [];
                if (Array.isArray(response.data)) {
                    finalData = response.data as ExtendedLahan[];
                } else {
                    const nested = response.data as unknown as LahanResponse;
                    finalData = nested.lahan || nested.data || [];
                }
                setDataLahan(finalData);
            }
        } catch (error) {
            console.error("Gagal memuat data lahan:", error);
            toast.error("Gagal memuat data lahan");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            void fetchLahan();
        }
    }, [fetchLahan, mounted]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(id);
        try {
            const response = await deleteLahan(id);
            if (response.success) {
                toast.success("Lahan berhasil dihapus");
                setDataLahan((prev) => prev.filter((item) => item.id !== id));
            } else {
                toast.error(response.message || "Gagal menghapus lahan");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsDeleting(null);
            setConfirmDelete(null);
        }
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/petani/lahan/${id}/edit`);
    };

    if (!mounted) return null;

    return (
        /* Hapus warna latar belakang di sini agar menggunakan variabel --background dari globals.css */
        <div className="space-y-6 min-h-screen" suppressHydrationWarning>
            <PageHeader
                title="Manajemen Lahan"
                description="Pantau koordinat geospasial dan ekosistem lahan Anda secara real-time."
                action={
                    <Button
                        className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 rounded-xl border-none"
                        onClick={() => router.push("/petani/lahan/tambah")}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Lahan
                    </Button>
                }
            />

            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-40 space-y-4">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse"></div>
                    </div>
                    <p className="text-slate-500 animate-pulse font-medium tracking-tight">Sinkronisasi data satelit...</p>
                </div>
            ) : !dataLahan || dataLahan.length === 0 ? (
                <EmptyState
                    icon="MapPin"
                    title="Grid Lahan Kosong"
                    description="Anda belum mendaftarkan lahan. Mulai petakan area pertanian Anda untuk mendapatkan analisis AI."
                    actionLabel="Daftarkan Lahan Pertama"
                    onAction={() => router.push("/petani/lahan/tambah")}
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {dataLahan.map((lahan) => {
                        const isThisConfirming = confirmDelete === lahan.id;
                        const hasPlants = Array.isArray(lahan.tanaman) && lahan.tanaman.length > 0;

                        return (
                            <Link key={lahan.id} href={`/petani/lahan/${lahan.id}`} className="group block">
                                {/* Ganti bg-slate-900 dengan bg-card agar sinkron dengan tema CSS */}
                                <Card className={`relative overflow-hidden transition-all duration-500 bg-card border border-border/50 shadow-xl ${isThisConfirming ? 'ring-2 ring-red-500/50 ring-offset-4 ring-offset-background scale-[0.98]' : 'hover:-translate-y-2 hover:border-blue-500/30'}`}>
                                    {/* Efek Gradasi Halus */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>

                                    <CardContent className="p-6 relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            {/* Ikon dengan warna biru aksen */}
                                            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-3 text-blue-400 shadow-inner group-hover:border-blue-400/50 transition-colors">
                                                <MapPin className="h-6 w-6" />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!isThisConfirming ? (
                                                    <>
                                                        <Badge className={`uppercase text-[9px] tracking-widest font-bold px-2 py-0.5 rounded-full border-none ${hasPlants ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                                            {hasPlants ? "Aktif" : "Idle"}
                                                        </Badge>
                                                        <div className="flex items-center bg-background/50 rounded-lg p-1 border border-border/50">
                                                            <button
                                                                onClick={(e) => handleEdit(e, lahan.id)}
                                                                className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(lahan.id); }}
                                                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 animate-in slide-in-from-right-4">
                                                        <button
                                                            onClick={(e) => handleDelete(e, lahan.id)}
                                                            disabled={isDeleting === lahan.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg hover:bg-red-500"
                                                        >
                                                            {isDeleting === lahan.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                                                            HAPUS
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(null); }}
                                                            className="p-1.5 bg-slate-800 text-slate-300 rounded-lg"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors line-clamp-1">
                                                {lahan.nama || "Lahan Tanpa Nama"}
                                            </h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                {lahan.kecamatan || lahan.lokasi?.kecamatan || "N/A"}, {lahan.kabupaten || lahan.lokasi?.kabupaten || "Koordinat Terdaftar"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-5 border-t border-border/30">
                                            <div className="bg-background/40 p-3 rounded-xl border border-border/20">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Luas Hamparan</p>
                                                <div className="flex items-center gap-2 text-foreground font-mono font-bold">
                                                    <Ruler className="h-4 w-4 text-blue-500 opacity-70" />
                                                    <span>{lahan.luasHektar ?? 0} <span className="text-[10px] text-slate-500">Ha</span></span>
                                                </div>
                                            </div>
                                            <div className="bg-background/40 p-3 rounded-xl border border-border/20">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Populasi</p>
                                                <div className="flex items-center gap-2 text-foreground font-mono font-bold">
                                                    <Sprout className="h-4 w-4 text-cyan-500 opacity-70" />
                                                    <span>{Array.isArray(lahan.tanaman) ? lahan.tanaman.length : 0} <span className="text-[10px] text-slate-500">Unit</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-end text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 tracking-widest">
                                            DETAIL LAHAN <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}