"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft, Save, Loader2, Sprout,
    Calendar, Tag, Info, LayoutList, ChevronRight, Leaf
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getLahanList, addTanaman } from "@/services/petani.service";
import { toast } from "react-hot-toast";
import type { Lahan } from "@/types";

function TambahTanamanContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const lahanIdFromUrl = searchParams.get("lahanId");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingLahan, setIsLoadingLahan] = useState(false);
    const [daftarLahan, setDaftarLahan] = useState<Lahan[]>([]);

    const [formData, setFormData] = useState({
        nama: "",
        varietasNama: "",
        lahanId: lahanIdFromUrl || "",
        tanggalTanam: new Date().toISOString().split('T')[0],
        estimasiPanen: "",
    });

    useEffect(() => {
        const fetchLahan = async () => {
            setIsLoadingLahan(true);
            try {
                const res = await getLahanList();
                if (res.success && res.data) {
                    setDaftarLahan(res.data);
                }
            } catch (error) {
                console.error("Fetch Lahan Error:", error);
                toast.error("Gagal memuat daftar lahan.");
            } finally {
                setIsLoadingLahan(false);
            }
        };

        fetchLahan();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lahanId) return toast.error("Silakan pilih lahan terlebih dahulu.");
        if (!formData.estimasiPanen) return toast.error("Silakan isi estimasi panen.");
        if (formData.estimasiPanen <= formData.tanggalTanam) return toast.error("Estimasi panen harus setelah tanggal tanam.");

        setIsSubmitting(true);
        const loadingToast = toast.loading("Mendaftarkan tanaman...");

        try {
            const response = await addTanaman(formData.lahanId, {
                nama: formData.nama,
                varietasNama: formData.varietasNama,
                tanggalTanam: formData.tanggalTanam,
                estimasiPanen: formData.estimasiPanen
            });

            if (response.success) {
                toast.success("Tanaman berhasil didaftarkan!", { id: loadingToast });
                router.push(`/petani/lahan/${formData.lahanId}`);
                router.refresh();
            } else {
                toast.error(response.message || "Gagal menyimpan data.", { id: loadingToast });
            }
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error("Terjadi kesalahan sistem.", { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/petani/lahan")}>Lahan</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">Registrasi Tanaman</span>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="group gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Kembali
                </Button>
            </div>

            <PageHeader
                title="Daftarkan Tanaman Baru"
                description="Input data komoditas untuk memulai pemantauan kesehatan vegetasi berbasis presisi satelit."
            />

            <div className="max-w-3xl">
                <Card className="border-none shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/10 relative">
                    {/* Decorative Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="space-y-10 p-6 sm:p-10">

                            {/* Section 1: Penempatan Lahan */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <LayoutList className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Lokasi Budidaya</h3>
                                </div>

                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em] ml-1">
                                        Pilih Lahan Penempatan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full p-4 pl-5 appearance-none bg-slate-950/50 border border-slate-800 rounded-2xl outline-none transition-all text-white shadow-xl ${
                                                lahanIdFromUrl
                                                    ? 'opacity-60 cursor-not-allowed border-primary/20 bg-primary/5'
                                                    : 'focus:ring-4 focus:ring-primary/10 focus:border-primary/50'
                                            }`}
                                            value={formData.lahanId}
                                            disabled={!!lahanIdFromUrl || isLoadingLahan}
                                            onChange={(e) => setFormData({...formData, lahanId: e.target.value})}
                                            required
                                        >
                                            <option value="" className="bg-slate-900 text-slate-400">--- Pilih Lahan ---</option>
                                            {daftarLahan.map((l) => (
                                                <option key={l.id} value={l.id} className="bg-slate-900 text-white">{l.nama}</option>
                                            ))}
                                        </select>
                                        {!lahanIdFromUrl && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="h-4 w-4 text-slate-500 rotate-90" />
                                            </div>
                                        )}
                                    </div>
                                    {lahanIdFromUrl && (
                                        <div className="flex items-center gap-2 mt-2 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <p className="text-[10px] text-primary font-black uppercase tracking-widest italic">
                                                Lahan Terkunci Otomatis
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: Identitas Tanaman */}
                            <div className="pt-10 border-t border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                        <Sprout className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Detail Komoditas</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Nama Tanaman
                                        </label>
                                        <div className="relative">
                                            <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-emerald-400" />
                                            <input
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                                placeholder="Contoh: Padi Ciherang"
                                                required
                                                value={formData.nama}
                                                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-emerald-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Varietas / Jenis
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-emerald-400" />
                                            <input
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                                placeholder="Contoh: Inpari 32"
                                                value={formData.varietasNama}
                                                onChange={(e) => setFormData({...formData, varietasNama: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Tanggal Tanam
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="date"
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-white shadow-xl scheme-dark"
                                                required
                                                value={formData.tanggalTanam}
                                                onChange={(e) => {
                                                    setFormData({...formData, tanggalTanam: e.target.value});
                                                    // Reset estimasiPanen jika tanggalTanam berubah
                                                    if (formData.estimasiPanen && e.target.value > formData.estimasiPanen) {
                                                        setFormData(prev => ({...prev, estimasiPanen: ""}));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-orange-400 transition-colors uppercase tracking-[0.2em] ml-1">
                                            Estimasi Panen
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-400 transition-colors" />
                                            <input
                                                type="date"
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all text-white shadow-xl scheme-dark"
                                                required
                                                min={formData.tanggalTanam}
                                                value={formData.estimasiPanen}
                                                onChange={(e) => setFormData({...formData, estimasiPanen: e.target.value})}
                                            />
                                        </div>
                                        {formData.tanggalTanam && formData.estimasiPanen && formData.estimasiPanen <= formData.tanggalTanam && (
                                            <p className="text-[10px] text-red-400 font-medium ml-1">
                                                Estimasi panen harus setelah tanggal tanam
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="p-5 bg-primary/5 rounded-4xl border border-primary/10 flex gap-4 items-start shadow-inner">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Info className="h-5 w-5 text-primary shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Analisis Pertumbuhan</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        AI akan menghitung indeks vegetasi (NDVI) dan memprediksi estimasi panen berdasarkan koordinat lahan dan tanggal tanam yang Anda masukkan.
                                    </p>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5">
                                <div className="flex items-center gap-4 group cursor-help">
                                    <div className="p-3 bg-slate-800 rounded-full group-hover:bg-primary/20 transition-colors">
                                        <Sprout className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">Status Registrasi</p>
                                        <p className="text-[9px] text-slate-500 font-medium">Data siap dikirim ke satelit</p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto min-w-70 h-16 text-xs font-black tracking-[0.2em] shadow-[0_20px_40px_rgba(var(--primary),0.2)] rounded-2xl transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white border-none flex items-center justify-center gap-4"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            DAFTARKAN TANAMAN
                                            <Save className="h-5 w-5 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function TambahTanamanPage() {
    return (
        <Suspense fallback={<div className="py-10 text-sm text-slate-400">Memuat halaman...</div>}>
            <TambahTanamanContent />
        </Suspense>
    );
}