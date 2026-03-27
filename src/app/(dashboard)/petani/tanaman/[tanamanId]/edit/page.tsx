"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, Leaf, Tag, Calendar, ChevronRight, Sprout } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "react-hot-toast";

interface TanamanData {
    nama: string;
    varietasNama: string;
    tanggalTanam: string;
    estimasiPanen: string;
}

export default function EditTanamanPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const tanamanId = params.tanamanId as string;
    const lahanId = searchParams.get("lahanId");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nama: "",
        varietasNama: "",
        tanggalTanam: "",
        estimasiPanen: "",
    });

    useEffect(() => {
        const fetchTanaman = async () => {
            try {
                const response = await apiGet(`/petani/tanaman/${tanamanId}`);
                if (response.success && response.data) {
                    const d = response.data as TanamanData;

                    setFormData({
                        nama: d.nama,
                        varietasNama: d.varietasNama,
                        tanggalTanam: new Date(d.tanggalTanam).toISOString().split('T')[0],
                        estimasiPanen: new Date(d.estimasiPanen).toISOString().split('T')[0],
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data tanaman");
            } finally {
                setIsLoading(false);
            }
        };

        if (tanamanId) void fetchTanaman();
    }, [tanamanId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await apiPatch(`/petani/tanaman/${tanamanId}`, formData);
            if (response.success) {
                toast.success("Data tanaman berhasil diperbarui");
                router.push(`/petani/lahan/${lahanId}`);
                router.refresh();
            } else {
                toast.error(response.message || "Gagal memperbarui data");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse rounded-full" />
                </div>
                <p className="text-slate-400 animate-pulse font-medium tracking-tight">Menghubungkan ke database tanaman...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/petani/lahan")}>Lahan</span>
                <ChevronRight className="h-3 w-3" />
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push(`/petani/lahan/${lahanId}`)}>Detail Lahan</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">Edit Tanaman</span>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="group gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Kembali
                </Button>
            </div>

            <PageHeader
                title={`Edit: ${formData.nama}`}
                description="Perbarui informasi komoditas atau jadwal estimasi panen untuk pemantauan presisi."
            />

            <div className="max-w-3xl">
                <Card className="border-none shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/10 relative">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="space-y-10 p-6 sm:p-10">

                            {/* Section 1: Data Komoditas */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <Leaf className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Identitas Komoditas</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em] ml-1">
                                            Nama Komoditas
                                        </label>
                                        <div className="relative">
                                            <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-primary" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                                placeholder="Contoh: Padi, Jagung"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em] ml-1">
                                            Varietas
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-primary" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                                placeholder="Contoh: Ciherang, Hibrida"
                                                value={formData.varietasNama}
                                                onChange={(e) => setFormData({ ...formData, varietasNama: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Jadwal Produksi */}
                            <div className="pt-10 border-t border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                        <Calendar className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Jadwal Produksi</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Tanggal Tanam
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-white shadow-xl scheme-dark"
                                            value={formData.tanggalTanam}
                                            onChange={(e) => setFormData({ ...formData, tanggalTanam: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Estimasi Panen
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-white shadow-xl scheme-dark"
                                            value={formData.estimasiPanen}
                                            onChange={(e) => setFormData({ ...formData, estimasiPanen: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
                                <div className="flex items-center gap-3 text-slate-500 group cursor-help">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Sistem Pemantauan Aktif</p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="flex-1 md:flex-none px-8 h-14 rounded-2xl border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-2 md:flex-none px-12 h-16 text-xs font-black tracking-[0.2em] shadow-[0_20px_40px_rgba(var(--primary),0.2)] rounded-2xl transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white border-none flex items-center justify-center gap-4"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                SIMPAN PERUBAHAN
                                                <Save className="h-5 w-5 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}