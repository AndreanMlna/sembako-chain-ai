"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft, Save, Loader2, MapPin, Navigation,
    Edit3, Target, Compass, Globe, Home, ChevronRight
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getLahanById, updateLahan } from "@/services/petani.service";
import type { LahanInput } from "@/lib/validators";
import { toast } from "react-hot-toast";

export default function DetailLahanEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [manualCoord, setManualCoord] = useState(false);

    const [formData, setFormData] = useState({
        nama: "",
        luasHektar: "",
        lokasi: {
            jalan: "",
            kelurahan: "",
            kecamatan: "",
            kabupaten: "",
            provinsi: "",
            kodePos: "",
            latitude: 0,
            longitude: 0
        }
    });

    const fetchLahanDetail = useCallback(async () => {
        try {
            const response = await getLahanById(id);
            if (response.success && response.data) {
                const d = response.data;
                setFormData({
                    nama: d.nama,
                    luasHektar: d.luasHektar.toString(),
                    lokasi: {
                        jalan: d.lokasi.jalan || "",
                        kelurahan: d.lokasi.kelurahan || "",
                        kecamatan: d.lokasi.kecamatan || "",
                        kabupaten: d.lokasi.kabupaten || "",
                        provinsi: d.lokasi.provinsi || "",
                        kodePos: d.lokasi.kodePos || "",
                        latitude: d.lokasi.latitude || 0,
                        longitude: d.lokasi.longitude || 0
                    }
                });
            } else {
                toast.error(response.message || "Data lahan tidak ditemukan.");
                router.push("/petani/lahan");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Gagal mengambil data lahan.");
        } finally {
            setIsLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) void fetchLahanDetail();
    }, [fetchLahanDetail, id]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Browser Anda tidak mendukung fitur lokasi/GPS.");
            return;
        }
        setIsDetecting(true);
        const onSuccess = async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
                ...prev,
                lokasi: { ...prev.lokasi, latitude, longitude }
            }));
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                if (data.address) {
                    const addr = data.address;
                    setFormData((prev) => ({
                        ...prev,
                        lokasi: {
                            ...prev.lokasi,
                            jalan: addr.road || addr.suburb || prev.lokasi.jalan,
                            kelurahan: addr.village || addr.hamlet || addr.village_sanitary || addr.town || prev.lokasi.kelurahan,
                            kecamatan: addr.city_district || addr.suburb || addr.municipality || prev.lokasi.kecamatan,
                            kabupaten: addr.city || addr.county || addr.regency || prev.lokasi.kabupaten,
                            provinsi: addr.state || prev.lokasi.provinsi,
                            kodePos: addr.postcode || prev.lokasi.kodePos
                        }
                    }));
                    toast.success("Koordinat & Alamat diperbarui!");
                }
            } catch (error) {
                console.error("Reverse Geocoding Error:", error);
            } finally {
                setIsDetecting(false);
                setManualCoord(false);
            }
        };
        const onError = () => {
            setIsDetecting(false);
            setManualCoord(true);
            toast.error("Gagal mendapatkan lokasi.");
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 10000 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading("Menyimpan perubahan...");
        try {
            const payload: LahanInput = {
                nama: formData.nama,
                luasHektar: Number(formData.luasHektar),
                lokasi: {
                    ...formData.lokasi,
                    latitude: Number(formData.lokasi.latitude),
                    longitude: Number(formData.lokasi.longitude)
                }
            };
            const response = await updateLahan(id, payload);
            if (response.success) {
                toast.success("Lahan berhasil diperbarui!", { id: loadingToast });
                router.refresh();
                setTimeout(() => router.push("/petani/lahan"), 1000);
            } else {
                toast.error(response.message || "Gagal memperbarui data.", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.", { id: loadingToast });
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
                <p className="text-slate-400 animate-pulse font-medium tracking-tight">Menghubungkan ke satelit data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigasi Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/petani/lahan")}>Lahan</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">Edit Detail</span>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="group gap-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Batal
                </Button>
            </div>

            <PageHeader
                title={`Edit Lahan: ${formData.nama}`}
                description="Perbarui informasi lokasi dan dimensi lahan untuk analisis vegetasi yang lebih akurat."
            />

            <Card className="border-none shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/10 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-10 p-6 sm:p-10">

                        {/* Section 1: Identitas Lahan */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">Identitas Lahan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em]">
                                        Nama Lahan
                                    </label>
                                    <input
                                        className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                        placeholder="Contoh: Sawah Utara Blok A"
                                        required
                                        value={formData.nama}
                                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em]">
                                        Luas Lahan (Ha)
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-white font-mono shadow-xl"
                                            placeholder="0.00"
                                            required
                                            value={formData.luasHektar}
                                            onChange={(e) => setFormData({...formData, luasHektar: e.target.value})}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-primary tracking-tighter shadow-lg group-focus-within/input:border-primary/30">
                                            HEKTAR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Titik Koordinat GPS */}
                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <Navigation className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Titik Geospasial</h3>
                                    </div>
                                    <p className="text-[11px] text-slate-500 ml-10">Sinkronisasi GPS memastikan akurasi data sensor cuaca.</p>
                                </div>

                                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setManualCoord(true)}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${manualCoord ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Manual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setManualCoord(false); handleGetLocation(); }}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!manualCoord ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Auto GPS
                                    </button>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden ${isDetecting ? 'bg-primary/5 border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.1)]' : 'bg-black/40 border-slate-800 shadow-inner'}`}>
                                {isDetecting && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                    </div>
                                )}

                                <div className="space-y-3 group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDetecting ? 'bg-primary animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        Garis Lintang (Lat)
                                    </label>
                                    <input
                                        type="number" step="any"
                                        readOnly={!manualCoord}
                                        className={`w-full p-5 bg-slate-900/50 border rounded-2xl text-2xl font-mono transition-all outline-none shadow-2xl ${manualCoord ? 'border-primary/40 text-white focus:ring-4 ring-primary/10' : 'border-transparent text-emerald-400 cursor-default'}`}
                                        value={formData.lokasi.latitude}
                                        onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, latitude: Number(e.target.value)}})}
                                    />
                                </div>

                                <div className="space-y-3 group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDetecting ? 'bg-primary animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        Garis Bujur (Long)
                                    </label>
                                    <input
                                        type="number" step="any"
                                        readOnly={!manualCoord}
                                        className={`w-full p-5 bg-slate-900/50 border rounded-2xl text-2xl font-mono transition-all outline-none shadow-2xl ${manualCoord ? 'border-primary/40 text-white focus:ring-4 ring-primary/10' : 'border-transparent text-emerald-400 cursor-default'}`}
                                        value={formData.lokasi.longitude}
                                        onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, longitude: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Informasi Wilayah */}
                        <div className="pt-10 border-t border-white/5 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Globe className="h-5 w-5 text-blue-400" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">Lokasi Administratif</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">Nama Jalan / Blok</label>
                                    <div className="relative">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-blue-400" />
                                        <input
                                            className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none"
                                            value={formData.lokasi.jalan}
                                            onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, jalan: e.target.value}})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">Kelurahan / Desa</label>
                                    <input
                                        className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none"
                                        value={formData.lokasi.kelurahan}
                                        onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, kelurahan: e.target.value}})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(['kecamatan', 'kabupaten', 'provinsi'] as const).map((field) => (
                                    <div key={field} className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">{field}</label>
                                        <input
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none"
                                            required
                                            value={formData.lokasi[field]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                lokasi: { ...formData.lokasi, [field]: e.target.value }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5">
                            <div className="flex items-center gap-4 group cursor-help">
                                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Edit3 className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">Verifikasi Satelit</p>
                                    <p className="text-[9px] text-slate-500 font-medium">Auto-mapping aktif melalui Nominatim OSM</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto min-w-60 h-16 text-xs font-black tracking-[0.2em] shadow-[0_20px_40px_rgba(var(--primary),0.2)] rounded-2xl transition-all active:scale-95 group bg-primary hover:bg-primary/90 text-white border-none flex items-center justify-center gap-4"
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}