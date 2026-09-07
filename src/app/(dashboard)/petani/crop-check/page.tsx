"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Upload, ShieldCheck, Zap, History, AlertTriangle, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { apiGet, apiUpload } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DiagnosisResult {
    id: string;
    fotoUrl: string;
    diagnosa: string;
    tingkatKeparahan: number;
    solusi: string[];
    statusKesehatan: "SEHAT" | "PERINGATAN" | "SAKIT";
    createdAt: string;
}

interface HistoryItem extends DiagnosisResult {
    tanaman: { id: string; nama: string; varietas: string } | null;
}

export default function CropCheckPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await apiGet<HistoryItem[]>("/petani/crop-check/history");
            if (res.success && res.data) setHistory(res.data);
        } catch {
            // silently fail
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!selectedFile || analyzing) return;
        setAnalyzing(true);
        try {
            const res = await apiUpload<DiagnosisResult>("/petani/crop-check", selectedFile);
            if (res.success && res.data) {
                setResult(res.data);
                fetchHistory();
            }
        } catch {
            // silently fail
        } finally {
            setAnalyzing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SEHAT":
                return <Badge variant="success">SEHAT</Badge>;
            case "PERINGATAN":
                return <Badge variant="warning">PERINGATAN</Badge>;
            case "SAKIT":
                return <Badge variant="danger">SAKIT</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SEHAT":
                return <CheckCircle2 className="h-8 w-8 text-green-500" />;
            case "PERINGATAN":
                return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
            case "SAKIT":
                return <XCircle className="h-8 w-8 text-red-500" />;
            default:
                return null;
        }
    };

    const getSeverityColor = (level: number) => {
        if (level < 30) return "bg-green-500";
        if (level < 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-8 animate-in pb-20">
            <PageHeader
                title="AI Crop Check"
                description="Diagnosa kesehatan tanaman menggunakan kamera AI secara real-time"
            />

            <div className="mx-auto max-w-2xl">
                {/* UPLOAD SECTION */}
                {!result ? (
                    <div className="group relative overflow-hidden rounded-[2rem] border-2 border-dashed border-border bg-card p-12 text-center transition-all hover:border-primary/50 shadow-xl">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />

                        <div className="relative z-10">
                            {preview ? (
                                <div className="space-y-6">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mx-auto max-h-64 rounded-2xl object-cover border border-border"
                                    />
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreview(null);
                                            }}
                                            disabled={analyzing}
                                        >
                                            Ganti Foto
                                        </Button>
                                        <Button
                                            className="gap-2 font-bold shadow-lg shadow-primary/20"
                                            onClick={handleAnalyze}
                                            disabled={analyzing}
                                        >
                                            {analyzing ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    AI Menganalisis...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="h-5 w-5" />
                                                    Analisis Tanaman
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                        <Camera className="h-12 w-12" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-foreground">
                                        Deteksi Penyakit Tanaman
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
                                        Ambil foto daun atau bagian tanaman yang sakit.
                                        Sistem AI akan menganalisis gejala dan memberikan rekomendasi penanganan instan.
                                    </p>

                                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        <Button
                                            className="gap-2 px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="h-5 w-5" />
                                            Upload Foto
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* RESULT CARD */}
                {result && (
                    <Card className="border-primary/20 shadow-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-foreground">Hasil Diagnosa</h3>
                                {getStatusBadge(result.statusKesehatan)}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <img
                                    src={result.fotoUrl}
                                    alt="Tanaman"
                                    className="w-full sm:w-40 h-40 rounded-xl object-cover border border-border"
                                />
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(result.statusKesehatan)}
                                        <p className="text-sm text-foreground/80 leading-relaxed">
                                            {result.diagnosa}
                                        </p>
                                    </div>

                                    {/* Severity Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-foreground/50">Tingkat Keparahan</span>
                                            <span className="font-bold">{result.tingkatKeparahan}%</span>
                                        </div>
                                        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-700",
                                                    getSeverityColor(result.tingkatKeparahan)
                                                )}
                                                style={{ width: `${result.tingkatKeparahan}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Solutions */}
                                    <div>
                                        <p className="text-xs font-bold text-foreground/50 uppercase mb-2">
                                            Rekomendasi Penanganan
                                        </p>
                                        <ul className="space-y-1.5">
                                            {result.solusi.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                                                    <span className="text-primary font-bold mt-0.5">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setResult(null);
                                        setSelectedFile(null);
                                        setPreview(null);
                                    }}
                                >
                                    Cek Lagi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Feature Info */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-5 border border-primary/10">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-foreground/80 tracking-tight uppercase">
                            Analisis berbasis aturan & AI-ready
                        </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-5 border border-primary/10">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Zap className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-foreground/80 tracking-tight uppercase">
                            Hasil instan — kurang dari 3 detik
                        </span>
                    </div>
                </div>

                {/* HISTORY */}
                <div className="mt-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-black text-foreground uppercase tracking-widest text-xs">
                            <History className="h-4 w-4 text-primary" /> Riwayat Diagnosa
                        </h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary text-xs font-bold"
                            onClick={fetchHistory}
                        >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Refresh
                        </Button>
                    </div>

                    {historyLoading ? (
                        <LoadingSpinner />
                    ) : history.length === 0 ? (
                        <Card className="rounded-3xl border border-dashed border-border bg-card/50">
                            <CardContent className="flex items-center justify-center py-16">
                                <p className="text-sm italic text-foreground/30 font-medium">
                                    Belum ada riwayat pengecekan tanaman.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <Card key={item.id} className="border-border hover:border-primary/30 transition-all">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <img
                                                src={item.fotoUrl}
                                                alt="Tanaman"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-foreground truncate">
                                                        {item.diagnosa}
                                                    </p>
                                                    {getStatusBadge(item.statusKesehatan)}
                                                </div>
                                                {item.tanaman && (
                                                    <p className="text-xs text-foreground/40">
                                                        {item.tanaman.nama} — {item.tanaman.varietas}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full">
                                                        <div
                                                            className={cn("h-full rounded-full", getSeverityColor(item.tingkatKeparahan))}
                                                            style={{ width: `${item.tingkatKeparahan}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-foreground/40">
                                                        {item.tingkatKeparahan}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
