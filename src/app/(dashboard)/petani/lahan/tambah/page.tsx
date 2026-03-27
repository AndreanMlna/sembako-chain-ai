"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Save, Loader2, MapPin, Navigation,
    Edit3, Target, Compass, Globe, Home, ChevronRight
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { createLahan } from "@/services/petani.service";
import { toast } from "react-hot-toast";

// Definisikan tipe untuk field lokasi agar aman dari 'any'
type LokasiAdminField = "kecamatan" | "kabupaten" | "provinsi";

export default function TambahLahanPage() {
    const router = useRouter();
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
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                const data = await res.json();

                if (data.address) {
                    const addr = data.address;
                    setFormData((prev) => ({
                        ...prev,
                        lokasi: {
                            ...prev.lokasi,
                            jalan: addr.road || addr.suburb || prev.lokasi.jalan,
                            kelurahan: addr.village || addr.hamlet || addr.town || prev.lokasi.kelurahan,
                            kecamatan: addr.city_district || addr.municipality || prev.lokasi.kecamatan,
                            kabupaten: addr.city || addr.county || addr.regency || prev.lokasi.kabupaten,
                            provinsi: addr.state || prev.lokasi.provinsi,
                            kodePos: addr.postcode || prev.lokasi.kodePos
                        }
                    }));
                    toast.success("Koordinat & Alamat diperbarui!");
                } else {
                    toast.success("Lokasi dikunci! Alamat tidak ditemukan.");
                }
            } catch (error) {
                console.error("Geocoding Error:", error);
                toast.success("Lokasi berhasil dikunci!");
            } finally {
                setIsDetecting(false);
                setManualCoord(false);
            }
        };

        const finalError = (error: GeolocationPositionError) => {
            setIsDetecting(false);
            setManualCoord(true);
            toast.error(error.code === 1 ? "Izin GPS ditolak." : "Gagal mendapatkan lokasi.");
        };

        navigator.geolocation.getCurrentPosition(onSuccess, (error) => {
            if (error.code === 3) {
                navigator.geolocation.getCurrentPosition(onSuccess, finalError, {
                    enableHighAccuracy: false,
                    timeout: 5000
                });
                return;
            }
            finalError(error);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.lokasi.latitude === 0 || formData.lokasi.longitude === 0) {
            toast.error("Mohon isi koordinat lokasi.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createLahan({
                nama: formData.nama,
                luasHektar: Number(formData.luasHektar),
                lokasi: formData.lokasi
            });

            if (response.success) {
                toast.success("Lahan berhasil disimpan!");
                router.refresh();
                router.push("/petani/lahan");
            } else {
                toast.error(response.message || "Gagal menyimpan.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigasi Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/petani/lahan")}>Lahan</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">Registrasi Lahan Baru</span>
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
                title="Daftarkan Lahan Baru"
                description="Lengkapi detail lokasi untuk analisis satelit dan kecerdasan buatan yang lebih presisi."
            />

            <Card className="border-none shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/10 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="space-y-10 p-6 sm:p-10">

                        {/* Section 1: Data Identitas */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">Identitas Lahan</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em] ml-1">
                                        Nama Lahan
                                    </label>
                                    <input
                                        className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-slate-700 shadow-xl"
                                        placeholder="Contoh: Sawah Utara Blok A"
                                        required
                                        value={formData.nama}
                                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors uppercase tracking-[0.2em] ml-1">
                                        Luas Lahan (Ha)
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white font-mono shadow-xl"
                                            placeholder="0.00"
                                            required
                                            value={formData.luasHektar}
                                            onChange={(e) => setFormData({...formData, luasHektar: e.target.value})}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-primary tracking-tighter shadow-lg">
                                            HEKTAR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Koordinat Geospasial */}
                        <div className="pt-10 border-t border-white/5 space-y-6">
                            {/* ... (Konten Header Koordinat tetap sama) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                            <Navigation className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Titik Geospasial</h3>
                                    </div>
                                    <p className="text-[11px] text-slate-500 ml-12">Gunakan GPS untuk akurasi pemetaan vegetasi satelit.</p>
                                </div>

                                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setManualCoord(!manualCoord)}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${manualCoord ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Manual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={isDetecting}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${!manualCoord ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {isDetecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
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

                                <div className="space-y-1 group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDetecting ? 'bg-primary animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        Latitude
                                    </label>
                                    {manualCoord ? (
                                        <input
                                            type="number" step="any"
                                            className="w-full p-5 bg-slate-900/50 border border-primary/40 rounded-2xl text-2xl font-mono text-white outline-none focus:ring-4 ring-primary/10 transition-all shadow-2xl"
                                            value={formData.lokasi.latitude}
                                            onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, latitude: Number(e.target.value)}})}
                                        />
                                    ) : (
                                        <div className="p-5 bg-slate-900/30 rounded-2xl border border-transparent">
                                            <p className="font-mono text-2xl font-bold text-emerald-400 tracking-tight">{formData.lokasi.latitude || "0.000000"}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isDetecting ? 'bg-primary animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        Longitude
                                    </label>
                                    {manualCoord ? (
                                        <input
                                            type="number" step="any"
                                            className="w-full p-5 bg-slate-900/50 border border-primary/40 rounded-2xl text-2xl font-mono text-white outline-none focus:ring-4 ring-primary/10 transition-all shadow-2xl"
                                            value={formData.lokasi.longitude}
                                            onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, longitude: Number(e.target.value)}})}
                                        />
                                    ) : (
                                        <div className="p-5 bg-slate-900/30 rounded-2xl border border-transparent">
                                            <p className="font-mono text-2xl font-bold text-emerald-400 tracking-tight">{formData.lokasi.longitude || "0.000000"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Alamat Administratif */}
                            <div className="pt-8 border-t border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                                        <Globe className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Lokasi Administratif</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">Jalan / Blok</label>
                                        <div className="relative">
                                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 transition-colors group-focus-within:text-blue-400" />
                                            <input
                                                className="w-full p-4 pl-12 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none shadow-inner"
                                                value={formData.lokasi.jalan}
                                                onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, jalan: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">Kelurahan / Desa</label>
                                        <input
                                            className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none shadow-inner"
                                            value={formData.lokasi.kelurahan}
                                            onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, kelurahan: e.target.value}})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(["kecamatan", "kabupaten", "provinsi"] as LokasiAdminField[]).map((field) => (
                                        <div key={field} className="space-y-3 group">
                                            <label className="text-[10px] font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors uppercase ml-1 tracking-widest">{field}</label>
                                            <input
                                                className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white outline-none"
                                                required
                                                value={formData.lokasi[field]}
                                                onChange={(e) => setFormData({...formData, lokasi: {...formData.lokasi, [field]: e.target.value}})}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5">
                            <div className="flex items-center gap-4 group cursor-help">
                                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Edit3 className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">Verifikasi AI</p>
                                    <p className="text-[9px] text-slate-500 font-medium">Data akan diverifikasi secara otomatis</p>
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
                                        DAFTARKAN LAHAN
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