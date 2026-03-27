"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
    Calendar, CheckCircle2, Timer, MapPin, Loader2, Search,
    Filter, X, Sparkles, TrendingUp, Package, Tag, FileText, Truck, Zap
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getLahanList, updateTanaman, getPrediksiHarga, createProduk } from "@/services/petani.service";
import { toast } from "react-hot-toast";
import { StatusPanen, type Tanaman, type Lahan, MetodeJual } from "@/types";
import type { TanamanInput, ProdukInput } from "@/lib/validators";

interface TanamanWithLahan extends Tanaman {
    namaLahan: string;
}

export default function ManajemenPanenPage() {
    const [mounted, setMounted] = useState(false);
    const [tanamanList, setTanamanList] = useState<TanamanWithLahan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

    // --- STATE UNTUK MODAL PANEN PINTAR ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTanaman, setSelectedTanaman] = useState<TanamanWithLahan | null>(null);
    const [harvestKg, setHarvestKg] = useState<string>("");
    const [autoSell, setAutoSell] = useState<boolean>(true);
    const [sellingPrice, setSellingPrice] = useState<string>("");
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);

    // --- STATE INPUT MANUAL UNTUK ETALASE ---
    const [listingNama, setListingNama] = useState("");
    const [listingKategori, setListingKategori] = useState("Hasil Panen");
    const [listingDeskripsi, setListingDeskripsi] = useState("");

    // UPDATE: Default ke FLEKSIBEL agar profesional dan didukung AI
    const [metodeJual, setMetodeJual] = useState<MetodeJual>(MetodeJual.FLEKSIBEL);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchDataPanen = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getLahanList();
            if (response.success && response.data) {
                const allTanaman = (response.data as Lahan[]).flatMap((lahan) =>
                    (lahan.tanaman || []).map((t) => ({
                        ...t,
                        namaLahan: lahan.nama
                    }))
                );
                setTanamanList(allTanaman);
            }
        } catch (error) {
            console.error("Error fetching harvest data:", error);
            toast.error("Gagal sinkronisasi data panen");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) fetchDataPanen();
    }, [mounted, fetchDataPanen]);

    const openHarvestModal = async (tanaman: TanamanWithLahan) => {
        setSelectedTanaman(tanaman);
        setHarvestKg("");
        setAutoSell(true);
        setSellingPrice("");

        setListingNama(`${tanaman.nama} (${tanaman.varietasNama})`);
        setListingKategori("Hasil Panen");
        setListingDeskripsi(`Hasil panen segar langsung dari ${tanaman.namaLahan}. Kualitas terjamin.`);

        // UPDATE: Reset ke FLEKSIBEL saat modal dibuka
        setMetodeJual(MetodeJual.FLEKSIBEL);

        setIsModalOpen(true);
        setIsFetchingPrice(true);

        try {
            const response = await getPrediksiHarga(tanaman.nama);
            if (response.success && response.data && response.data.length > 0) {
                setSellingPrice(response.data[0].prediksiHargaRp.toString());
                toast.success("AI berhasil memprediksi harga pasar hari ini!");
            }
        } catch (error) {
            console.error("Gagal menarik harga AI:", error);
        } finally {
            setIsFetchingPrice(false);
        }
    };

    const submitHarvest = async () => {
        if (!selectedTanaman || !harvestKg) {
            toast.error("Masukkan jumlah hasil panen (Kg) terlebih dahulu.");
            return;
        }

        setIsProcessingId(selectedTanaman.id);

        try {
            const payloadTanaman = {
                statusPanen: StatusPanen.DIPANEN,
                jumlahKg: parseFloat(harvestKg)
            } as unknown as Partial<TanamanInput>;

            const resTanaman = await updateTanaman(selectedTanaman.id, payloadTanaman);
            if (!resTanaman.success) throw new Error("Gagal update status panen.");

            if (autoSell && sellingPrice) {
                const payloadProduk: ProdukInput = {
                    nama: listingNama,
                    kategori: listingKategori,
                    deskripsi: listingDeskripsi,
                    satuan: "kg",
                    hargaPerSatuan: parseFloat(sellingPrice),
                    stokTersedia: parseFloat(harvestKg),
                    metodeJual: metodeJual,
                };

                await createProduk(payloadProduk);
                toast.success("Produk berhasil diposting ke etalase!");
            }

            toast.success(`${selectedTanaman.nama} sukses dipanen!`);
            setIsModalOpen(false);
            fetchDataPanen();

        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan sistem saat memproses panen.");
        } finally {
            setIsProcessingId(null);
        }
    };

    if (!mounted) return null;

    const filteredTanaman = tanamanList.filter((item) => {
        if (item.statusPanen === StatusPanen.DIPANEN) return false;
        const matchesSearch =
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.namaLahan.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" ? true : item.statusPanen === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 min-h-screen pb-10" suppressHydrationWarning>
            <PageHeader
                title="Manajemen Panen"
                description="Monitor siklus hidup tanaman, filter status, dan catat hasil panen ke etalase."
            />

            {/* Filter UI - Tetap Sama */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari tanaman atau lahan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-card border border-border/50 rounded-xl text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-card border border-border/50 rounded-xl text-sm text-foreground appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none cursor-pointer transition-all"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value={StatusPanen.SIAP_PANEN}>Siap Panen</option>
                        <option value={StatusPanen.TUMBUH}>Pertumbuhan</option>
                        <option value={StatusPanen.TANAM}>Baru Tanam</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-40 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-slate-500 animate-pulse font-medium">Menganalisis siklus vegetasi...</p>
                </div>
            ) : filteredTanaman.length === 0 ? (
                <EmptyState
                    icon="Wheat"
                    title={tanamanList.length === 0 ? "Data Panen Kosong" : "Tanaman Tidak Ditemukan"}
                    description={tanamanList.length === 0
                        ? "Tambahkan tanaman pada manajemen lahan untuk mulai memantau jadwal panen."
                        : "Tidak ada tanaman yang sesuai dengan filter/pencarian Anda."
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {filteredTanaman.map((item) => {
                        const isReady = item.statusPanen === StatusPanen.SIAP_PANEN;
                        const isProcessingThis = isProcessingId === item.id;

                        let visualProgress = 0;
                        if (isReady) visualProgress = 100;
                        else if (item.tanggalTanam && item.estimasiPanen) {
                            const start = new Date(item.tanggalTanam).getTime();
                            const end = new Date(item.estimasiPanen).getTime();
                            const now = new Date().getTime();
                            const totalDuration = end - start;
                            const elapsed = now - start;
                            if (totalDuration > 0) {
                                const rawProgress = Math.round((elapsed / totalDuration) * 100);
                                visualProgress = Math.min(Math.max(rawProgress, 0), 100);
                            }
                        } else {
                            visualProgress = item.statusPanen === StatusPanen.TUMBUH ? 65 : 15;
                        }

                        return (
                            <Card key={item.id} className="relative overflow-hidden bg-card border border-border/40 shadow-xl group hover:border-blue-500/20 transition-all">
                                <div className={`absolute top-0 left-0 w-1 h-full ${isReady ? 'bg-blue-500' : 'bg-slate-700'}`} />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1.5">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors">
                                                {item.nama} <span className="text-sm font-normal text-slate-500">({item.varietasNama})</span>
                                            </h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                                <MapPin className="h-3.5 w-3.5 text-blue-500/70" /> {item.namaLahan}
                                            </p>
                                        </div>
                                        <Badge className={`uppercase text-[10px] tracking-widest font-black px-2.5 py-1 rounded-lg border-none ${
                                            isReady ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-400"
                                        }`}>
                                            {item.statusPanen.replace("_", " ")}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fase Siklus</span>
                                            <span className="text-sm font-mono font-bold text-blue-400">{visualProgress}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-800 border border-slate-700/50 p-[1px]">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                                                style={{ width: `${visualProgress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-5">
                                        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                                            <div className="p-1.5 rounded-lg bg-slate-800/50 text-blue-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase leading-none mb-1">Estimasi Panen</span>
                                                <strong className="text-slate-200">
                                                    {item.estimasiPanen ? new Date(item.estimasiPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </strong>
                                            </div>
                                        </div>
                                        {isReady ? (
                                            <button
                                                onClick={() => openHarvestModal(item)}
                                                disabled={isProcessingThis}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg"
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> Eksekusi Panen
                                            </button>
                                        ) : (
                                            <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-tighter bg-slate-800/30 px-3 py-1.5 rounded-lg border border-slate-800">
                                                <Timer className="h-3.5 w-3.5 animate-pulse" /> Monitoring
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* --- MODAL EKSEKUSI PANEN PINTAR --- */}
            {isModalOpen && selectedTanaman && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto">
                        <div className="flex justify-between items-center p-5 border-b border-slate-800/60 bg-slate-950/30">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                                <Package className="h-5 w-5 text-blue-500" /> Konfirmasi & Listing Panen
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hasil Panen (Kg)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={harvestKg}
                                            onChange={(e) => setHarvestKg(e.target.value)}
                                            placeholder="500"
                                            className="w-full pl-4 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500/50"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">Kg</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kategori Produk</label>
                                    <select
                                        value={listingKategori}
                                        onChange={(e) => setListingKategori(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm outline-none focus:border-blue-500/50"
                                    >
                                        <option value="Sayuran">Sayuran</option>
                                        <option value="Bumbu">Bumbu</option>
                                        <option value="Buah">Buah</option>
                                        <option value="Hasil Panen">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="autoSell"
                                        checked={autoSell}
                                        onChange={(e) => setAutoSell(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-500"
                                    />
                                    <div className="space-y-1">
                                        <label htmlFor="autoSell" className="text-sm font-bold text-white cursor-pointer">Posting ke Etalase Jual</label>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">Otomatis membuat produk di pasar digital agar bisa dibeli mitra.</p>
                                    </div>
                                </div>

                                {autoSell && (
                                    <div className="pl-7 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1.5">
                                                <Tag className="h-3 w-3" /> Nama Produk Etalase
                                            </label>
                                            <input
                                                type="text"
                                                value={listingNama}
                                                onChange={(e) => setListingNama(e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1.5">
                                                    <TrendingUp className="h-3 w-3" /> Harga (Rp/Kg)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={sellingPrice}
                                                        onChange={(e) => setSellingPrice(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">Rp</span>
                                                    {isFetchingPrice && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-500 animate-spin" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1.5">
                                                    <Truck className="h-3 w-3" /> Metode Jual
                                                </label>
                                                <select
                                                    value={metodeJual}
                                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMetodeJual(e.target.value as MetodeJual)}
                                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none focus:border-blue-500/50"
                                                >
                                                    {/* UPDATE: Menambahkan opsi FLEKSIBEL dengan label Optimasi AI */}
                                                    <option value={MetodeJual.FLEKSIBEL}>FLEKSIBEL (Optimasi AI)</option>
                                                    <option value={MetodeJual.DISTRIBUSI}>DISTRIBUSI (B2B)</option>
                                                    <option value={MetodeJual.LANGSUNG}>LANGSUNG (B2C)</option>
                                                </select>
                                                {metodeJual === MetodeJual.FLEKSIBEL && (
                                                    <p className="text-[9px] text-blue-300 italic flex items-center gap-1 mt-1">
                                                        <Zap className="h-2 w-2" /> AI akan menentukan alokasi terbaik.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1.5">
                                                <FileText className="h-3 w-3" /> Deskripsi Produk
                                            </label>
                                            <textarea
                                                value={listingDeskripsi}
                                                onChange={(e) => setListingDeskripsi(e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white outline-none focus:border-blue-500/50 resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-800/60 bg-slate-950/30 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">Batal</button>
                            <button
                                onClick={submitHarvest}
                                disabled={isProcessingId !== null || !harvestKg}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                            >
                                {isProcessingId !== null ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Simpan & Panen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}