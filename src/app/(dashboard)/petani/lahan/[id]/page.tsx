"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Sprout, Calendar, Activity, Loader2,
    Plus, Trash2, Edit3, Target, Compass, AlertTriangle,
    CheckCircle2, Info, Edit2
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/shared/EmptyState";
import { getLahanById, updateTanamanStatusOtomatis, updateTanaman } from "@/services/petani.service";
import { apiDelete } from "@/lib/api";
import type { Lahan } from "@/types";
import { toast } from "react-hot-toast";

interface UpdateTanamanPayload {
    statusPanen: string;
    tanggalTanam: string;
    estimasiPanen?: string;
}

export default function LahanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [lahan, setLahan] = useState<Lahan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTanaman, setSelectedTanaman] = useState<{id: string, nama: string} | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk Modal Tanam Lagi
    const [isTanamLagiOpen, setIsTanamLagiOpen] = useState(false);
    const [isEditManual, setIsEditManual] = useState(false); // State baru untuk kontrol manual
    const [tanamLagiData, setTanamLagiData] = useState({
        id: "",
        nama: "",
        tanggalTanam: new Date().toISOString().split('T')[0],
        estimasiPanen: "",
        durasiHari: 90 // Default durasi
    });

    const updateStatusTanaman = async () => {
        setIsUpdatingStatus(true);
        try {
            await updateTanamanStatusOtomatis();
        } catch (error) {
            console.error("Gagal update status tanaman:", error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const fetchDetailLahan = useCallback(async () => {
        try {
            const response = await getLahanById(id);
            if (response.success && response.data) {
                setLahan(response.data);
            }
        } catch {
            console.error("Gagal memuat detail lahan:");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            await updateStatusTanaman();
            await fetchDetailLahan();
        };
        void loadData();
    }, [id, fetchDetailLahan]);

    useEffect(() => {
        // Logika otomatis hanya berjalan jika TIDAK dalam mode edit manual
        if (tanamLagiData.tanggalTanam && !isEditManual) {
            const date = new Date(tanamLagiData.tanggalTanam);
            date.setDate(date.getDate() + tanamLagiData.durasiHari);
            setTanamLagiData(prev => ({
                ...prev,
                estimasiPanen: date.toISOString().split('T')[0]
            }));
        }
    }, [tanamLagiData.tanggalTanam, tanamLagiData.durasiHari, isEditManual]);

    const handleTambahTanaman = () => {
        router.push(`/petani/tanaman/tambah?lahanId=${id}`);
    };

    const handleUpdateTanaman = (tanamanId: string) => {
        router.push(`/petani/tanaman/${tanamanId}/edit?lahanId=${id}`);
    };

    const handleTanamLagi = (tanamanId: string, nama: string) => {
        setIsEditManual(false); // Reset ke mode AI setiap kali modal dibuka
        setTanamLagiData(prev => ({
            ...prev,
            id: tanamanId,
            nama,
            tanggalTanam: new Date().toISOString().split('T')[0]
        }));
        setIsTanamLagiOpen(true);
    };

    const executeTanamLagi = async () => {
        setIsUpdatingStatus(true);
        try {
            const payload: UpdateTanamanPayload = {
                statusPanen: "TUMBUH",
                tanggalTanam: new Date(tanamLagiData.tanggalTanam).toISOString(),
                estimasiPanen: new Date(tanamLagiData.estimasiPanen).toISOString(),
            };

            const response = await updateTanaman(tanamLagiData.id, payload as Parameters<typeof updateTanaman>[1]);
            if (response.success) {
                toast.success(`Siklus baru untuk ${tanamLagiData.nama} telah dimulai!`);
                setIsTanamLagiOpen(false);
                await fetchDetailLahan();
            } else {
                toast.error("Gagal mereset siklus tanam");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const confirmDelete = (id: string, nama: string) => {
        setSelectedTanaman({ id, nama });
        setIsDeleteDialogOpen(true);
    };

    const executeDelete = async () => {
        if (!selectedTanaman) return;
        setIsDeleting(true);
        try {
            const response = await apiDelete(`/petani/tanaman/${selectedTanaman.id}`);
            if (response.success) {
                toast.success(`${selectedTanaman.nama} berhasil dihapus`);
                setIsDeleteDialogOpen(false);
                void fetchDetailLahan();
            } else {
                toast.error(response.message || "Gagal menghapus");
            }
        } catch {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading || isUpdatingStatus) {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-slate-400 animate-pulse font-medium">
                    {isUpdatingStatus ? "Memperbarui status tanaman..." : "Sinkronisasi data lahan..."}
                </p>
            </div>
        );
    }

    if (!lahan) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.push("/petani/lahan")} className="gap-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Lahan
                </Button>
                <EmptyState
                    icon="AlertTriangle"
                    title="Lahan Tidak Ditemukan"
                    description="Data lahan yang Anda cari tidak ada atau mungkin sudah dihapus."
                    actionLabel="Kembali"
                    onAction={() => router.push("/petani/lahan")}
                />
            </div>
        );
    }

    const alamatLengkap = `${lahan.lokasi.jalan ? lahan.lokasi.jalan + ', ' : ''}${lahan.lokasi.kelurahan ? 'Kel. ' + lahan.lokasi.kelurahan + ', ' : ''}Kec. ${lahan.lokasi.kecamatan}, Kab. ${lahan.lokasi.kabupaten}`;

    return (
        <div className="space-y-6 pb-10 relative">
            {/* Modal Delete */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm bg-slate-900 border-slate-800 shadow-2xl scale-in-center">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Hapus Tanaman?</h3>
                                <p className="text-slate-400 text-sm mt-2">
                                    Anda akan menghapus <span className="text-white font-semibold">{selectedTanaman?.nama}</span>. Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-slate-800 text-slate-300 hover:bg-slate-800"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={executeDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal Tanam Lagi Interaktif */}
            {isTanamLagiOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
                        <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20">
                            <CardTitle className="flex items-center gap-3 text-emerald-400">
                                <Sprout className="h-5 w-5" />
                                Siklus Tanam Baru: {tanamLagiData.nama}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanggal Tanam</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                        <input
                                            type="date"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                            value={tanamLagiData.tanggalTanam}
                                            onChange={(e) => setTanamLagiData({...tanamLagiData, tanggalTanam: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Panel Prediksi AI dengan Opsi Edit Manual */}
                                <div className={`p-4 border rounded-2xl space-y-3 relative overflow-hidden group transition-colors ${isEditManual ? 'bg-slate-950 border-slate-700' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <Activity className={`h-4 w-4 ${!isEditManual && 'animate-pulse'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                                {isEditManual ? "Manual Adjustment" : "AI Prediction Engine"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setIsEditManual(!isEditManual)}
                                            className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                            {isEditManual ? "Gunakan Estimasi AI" : "Edit Manual"}
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase">Estimasi Panen</p>
                                        {isEditManual ? (
                                            <input
                                                type="date"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                                                value={tanamLagiData.estimasiPanen}
                                                onChange={(e) => setTanamLagiData({...tanamLagiData, estimasiPanen: e.target.value})}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-white">
                                                    {new Date(tanamLagiData.estimasiPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <Badge variant="info" className="text-[9px] border-blue-500/30 text-blue-400 bg-blue-500/10 uppercase tracking-tighter">Optimum</Badge>
                                            </div>
                                        )}
                                    </div>

                                    {!isEditManual && (
                                        <div className="flex items-start gap-2 pt-2 border-t border-blue-500/10 text-[10px] text-slate-400 italic">
                                            <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                            <span>Dihitung otomatis berdasarkan data historis varietas {tanamLagiData.nama}.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-800"
                                    onClick={() => setIsTanamLagiOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    onClick={executeTanamLagi}
                                >
                                    Mulai Tanam
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/petani/lahan")}
                    className="w-fit gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>

                <PageHeader
                    title={lahan.nama}
                    description={alamatLengkap}
                    action={
                        <Button
                            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            onClick={handleTambahTanaman}
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Tanaman
                        </Button>
                    }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="rounded-2xl bg-primary/10 p-4 text-primary group-hover:scale-110 transition-transform duration-300">
                            <Compass className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Luas Wilayah</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-white">{lahan.luasHektar}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">Hektar</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <Target className="h-7 w-7" />
                        </div>
                        <div className="w-full">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Titik Koordinat</p>
                            <div className="flex items-center gap-3 mt-1 text-emerald-400 font-mono text-sm font-bold">
                                <span>LAT: {lahan.lokasi.latitude.toFixed(6)}</span>
                                <span className="text-slate-700">|</span>
                                <span>LNG: {lahan.lokasi.longitude.toFixed(6)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-none shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50 relative">
                    <CardTitle className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Sprout className="h-5 w-5 text-primary" />
                        </div>
                        <span>Daftar Tanaman & Status Vegetasi</span>
                    </CardTitle>

                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                await updateStatusTanaman();
                                await fetchDetailLahan();
                                toast.success("Status tanaman berhasil diperbarui");
                            }}
                            disabled={isUpdatingStatus}
                            className={`
                                gap-2 border-slate-700 text-slate-300 hover:bg-primary hover:text-white hover:border-primary
                                transition-all duration-300 ease-in-out transform hover:scale-105
                                ${isUpdatingStatus ? 'animate-pulse bg-primary/20 border-primary' : 'hover:shadow-lg hover:shadow-primary/20'}
                                relative overflow-hidden
                            `}
                        >
                            <div className="relative z-10 flex items-center gap-2">
                                {isUpdatingStatus ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="text-lg">🔄</span>
                                )}
                                <span className="font-medium">
                                    {isUpdatingStatus ? "Updating..." : "Refresh Status"}
                                </span>
                            </div>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {!lahan.tanaman || lahan.tanaman.length === 0 ? (
                        <EmptyState
                            icon="Sprout"
                            title="Belum Ada Tanaman"
                            description="Mulai kelola lahan Anda dengan menambahkan tanaman pertama."
                            actionLabel="Mulai Menanam"
                            onAction={handleTambahTanaman}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lahan.tanaman.map((t) => {
                                const isDipanen = t.statusPanen === "DIPANEN";
                                return (
                                    <Card key={t.id} className={`bg-slate-950 border-slate-800 hover:border-primary/50 transition-all duration-300 shadow-lg group ${isDipanen ? 'border-emerald-500/20' : ''}`}>
                                        <CardContent className="p-6 space-y-5">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{t.nama}</h4>
                                                    <p className="text-xs font-semibold text-slate-500 uppercase">{t.varietasNama}</p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleUpdateTanaman(t.id)}
                                                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(t.id, t.nama)}
                                                        className="p-2 rounded-lg bg-slate-900 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <Badge
                                                variant={t.statusKesehatan === "SEHAT" ? "success" : t.statusKesehatan === "SAKIT" ? "danger" : "warning"}
                                                className="rounded-full"
                                            >
                                                {t.statusKesehatan}
                                            </Badge>

                                            <div className="space-y-3 pt-4 border-t border-slate-800/60">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Activity className="h-3.5 w-3.5 text-primary" />
                                                        <span>Fase</span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`font-bold uppercase ${isDipanen ? 'text-emerald-400' : 'text-white'}`}>
                                                            {t.statusPanen.replace("_", " ")}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 text-right">
                                                            {t.statusPanen === "TANAM" && "Belum ditanam"}
                                                            {t.statusPanen === "TUMBUH" && "Sedang tumbuh"}
                                                            {t.statusPanen === "SIAP_PANEN" && "Siap dipanen"}
                                                            {t.statusPanen === "DIPANEN" && "Siklus selesai"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar className="h-3.5 w-3.5 text-primary" />
                                                        <span>Estimasi Panen</span>
                                                    </div>
                                                    <span className="text-slate-200 font-mono">
                                                        {new Date(t.estimasiPanen).toLocaleDateString("id-ID", {
                                                            day: "numeric", month: "short", year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {isDipanen && (
                                                    <Button
                                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all gap-2"
                                                        onClick={() => handleTanamLagi(t.id, t.nama)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Tanam Lagi
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    className="w-full bg-slate-900 hover:bg-primary hover:text-white border-none text-slate-300 font-bold transition-all"
                                                    onClick={() => router.push(`/petani/crop-check?tanamanId=${t.id}`)}
                                                >
                                                    AI Crop Check
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader className="border-b border-slate-800">
                    <CardTitle className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Activity className="h-5 w-5 text-blue-400" />
                        </div>
                        <span>Penjelasan Status Panen Tanaman</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                <span className="text-white font-bold text-sm">TANAM</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">Tanaman belum ditanam. Tanggal tanam di masa depan.</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-white font-bold text-sm">TUMBUH</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">Tanaman sedang dalam fase pertumbuhan aktif.</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-white font-bold text-sm">SIAP PANEN</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">Tanaman sudah melewati masa estimasi panen.</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-white font-bold text-sm">DIPANEN</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">Siklus selesai. Gunakan fitur <strong>Tanam Lagi</strong> untuk mulai baru.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}