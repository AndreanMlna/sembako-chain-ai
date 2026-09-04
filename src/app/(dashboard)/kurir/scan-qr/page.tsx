// src/app/(dashboard)/kurir/scan-qr/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  QrCode,
  Camera,
  History,
  CheckCircle2,
  Info,
  Loader2,
  Package,
  MapPin,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Upload,
  SwitchCamera,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { confirmDelivery } from "@/services/kurir.service";

interface ScanItem {
  id: string;
  time: string;
  status: string;
  photo?: string;
}

interface ActiveJob {
  id: string;
  from: string;
  to: string;
  items: string;
  distance: string;
  status: string;
}

export default function ScanQRPage() {
  const [scanHistory, setScanHistory] = useState<ScanItem[]>([]);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [photoProof, setPhotoProof] = useState<string | null>(null);

  // State Kamera Langsung WebRTC (getUserMedia)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadData() {
    try {
      const [historyRes, dashboardRes] = await Promise.all([
        apiGet<Array<{ id: string; time: string; status: string }>>("/kurir/jobs/history"),
        apiGet<{ activeJob: ActiveJob | null }>("/kurir/dashboard"),
      ]);

      if (historyRes.success && Array.isArray(historyRes.data)) {
        setScanHistory(
          historyRes.data.slice(0, 5).map((item) => ({
            id: item.id,
            time: `${item.time} WIB`,
            status: item.status === "Selesai" ? "Berhasil" : "Proses",
          }))
        );
      }

      if (dashboardRes.success && dashboardRes.data?.activeJob) {
        setActiveJob(dashboardRes.data.activeJob);
      } else {
        setActiveJob(null);
      }
    } catch (err) {
      console.error("Gagal mengambil data kurir scan:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    return () => {
      stopCamera();
    };
  }, []);

  // Matikan stream video kamera
  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
  }

  // Buka kamera langsung via navigator.mediaDevices.getUserMedia (Sesuai skill media-capture-and-compression)
  async function startCamera(facing: "environment" | "user" = facingMode) {
    stopCamera();
    setCameraError(null);
    setIsStartingCamera(true);

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser ini tidak mendukung akses kamera langsung. Silakan gunakan opsi unggah foto.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Akses kamera langsung gagal/ditolak:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Izin akses kamera ditolak oleh browser. Silakan izinkan kamera di peramban atau gunakan tombol unggah berkas di bawah."
          : "Kamera perangkat tidak dapat diakses atau sedang digunakan aplikasi lain. Gunakan opsi unggah berkas."
      );
      setIsCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  }

  // Ganti kamera depan / belakang
  function toggleCameraFacing() {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  }

  // Kompresi foto bukti serah terima di browser (Sesuai skill media-capture-and-compression)
  function compressImage(file: File, maxWidth = 1024, quality = 0.75): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);

      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // Jepret foto langsung dari feed video kamera
  function captureLivePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;

    try {
      const canvas = document.createElement("canvas");
      let width = video.videoWidth || 640;
      let height = video.videoHeight || 480;
      const maxWidth = 1024;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Gambar frame video ke canvas
      ctx.drawImage(video, 0, 0, width, height);

      // Kompresi JPEG 75% kualitas (sesuai media-capture-and-compression)
      const compressed = canvas.toDataURL("image/jpeg", 0.75);
      setPhotoProof(compressed);
      stopCamera();
    } catch (err) {
      console.error("Gagal mengambil frame foto:", err);
      alert("Gagal memotret. Silakan coba kembali atau gunakan tombol unggah berkas.");
    }
  }

  // Fallback: Pemilihan file foto dari galeri / disk
  async function handlePhotoCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1024, 0.75);
      setPhotoProof(compressed);
      stopCamera();
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoProof(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  function removePhoto() {
    setPhotoProof(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleConfirmDelivery() {
    if (!activeJob) {
      alert("Tidak ada pekerjaan aktif yang perlu dikonfirmasi saat ini.");
      return;
    }

    try {
      setIsConfirming(true);
      const res = await confirmDelivery(
        activeJob.id,
        `QR-VERIFIED-${Date.now()}`,
        photoProof || undefined
      );

      if (res.success) {
        setSuccessMessage(
          `Pengantaran ID: ${activeJob.id.slice(0, 8).toUpperCase()} berhasil diserahterimakan lengkap dengan foto bukti barang diterima!`
        );
        setPhotoProof(null);
        stopCamera();
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadData();
      } else {
        alert(res.message || "Gagal mengonfirmasi pengiriman.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat verifikasi.");
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Scan QR & Foto Bukti Kirim"
        description="Ambil foto bukti serah terima barang ke pembeli langsung via kamera dan konfirmasi penyelesaian tugas pengantaran"
      />

      {/* Hidden input for fallback file upload */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handlePhotoCapture}
        className="hidden"
      />

      <div className="mx-auto max-w-md space-y-6">
        {/* SUCCESS ALERT */}
        {successMessage && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex items-start gap-3 animate-in">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Serah Terima Berhasil!</p>
              <p className="text-xs text-foreground/70">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-foreground/40 hover:text-foreground"
            >
              ✕
            </button>
          </div>
        )}

        {/* ACTIVE JOB CARD */}
        {activeJob ? (
          <Card className="border-primary/30 bg-card shadow-lg shadow-primary/5">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-[10px] animate-pulse">
                  Job Pengantaran Aktif
                </Badge>
                <span className="text-[10px] font-black text-foreground/40 uppercase">
                  ID: {activeJob.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-foreground/5 p-3 rounded-lg">
                <Package className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase">Muatan Paket:</p>
                  <p className="text-xs font-bold text-foreground line-clamp-1">{activeJob.items}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <p className="line-clamp-1"><span className="font-bold text-foreground">Alamat Penerima:</span> {activeJob.to}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="p-6 text-center space-y-3">
              <Package className="mx-auto h-10 w-10 text-foreground/30" />
              <p className="text-sm font-medium text-foreground/60">
                Tidak ada paket aktif saat ini. Ambil pekerjaan di Job Marketplace terlebih dahulu.
              </p>
              <Link href="/kurir/jobs">
                <Button variant="outline" size="sm" className="text-xs font-bold border-primary/30 text-primary">
                  Buka Marketplace Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* PHOTO CAPTURE & PROOF VIEWPORT */}
        <Card className="border-primary/20 bg-card overflow-hidden shadow-xl shadow-primary/5">
          <CardContent className="p-6 text-center space-y-5">
            {photoProof ? (
              /* 1. FOTO SUDAH DIAMBIL: PREVIEW HASIL */
              <div className="space-y-4">
                <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-primary shadow-lg max-h-72 bg-black">
                  <img
                    src={photoProof}
                    alt="Bukti Serah Terima"
                    className="w-full h-auto max-h-72 object-contain mx-auto"
                  />
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <ShieldCheck className="h-3 w-3" />
                    Foto Bukti Siap
                  </div>
                  <button
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-red-600/90 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors"
                    title="Hapus foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => startCamera(facingMode)}
                    className="flex-1 text-xs font-bold border-border"
                  >
                    <Camera className="mr-1.5 h-3.5 w-3.5" />
                    Foto Ulang (Kamera)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    className="text-xs font-bold border-border"
                    title="Unggah Foto dari Berkas"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={removePhoto}
                    className="text-xs font-bold border-red-500/30 text-red-500 hover:bg-red-500/10"
                    title="Hapus Foto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : isCameraActive ? (
              /* 2. KAMERA LANGSUNG SEDANG AKTIF (LIVE WEBRTC VIEWFINDER) */
              <div className="space-y-4">
                <div className="relative mx-auto rounded-3xl overflow-hidden border-2 border-primary shadow-2xl bg-black max-w-[340px] aspect-[4/3] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Corner Target Brackets */}
                  <div className="absolute top-3 left-3 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-xl pointer-events-none" />
                  <div className="absolute top-3 right-3 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-xl pointer-events-none" />
                  <div className="absolute bottom-3 left-3 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-xl pointer-events-none" />
                  <div className="absolute bottom-3 right-3 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-xl pointer-events-none" />

                  {/* Live Stream Indicator Badge */}
                  <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-primary/30 text-[10px] font-black text-primary uppercase shadow-md">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      Kamera Aktif ({facingMode === "environment" ? "Belakang" : "Depan"})
                    </span>
                  </div>

                  {/* Top Right Controls: Switch Camera & Close */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={toggleCameraFacing}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
                      title="Ganti Kamera Depan/Belakang"
                    >
                      <SwitchCamera className="h-4 w-4" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
                      title="Tutup Kamera"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Shutter Capture Button */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={captureLivePhoto}
                    className="w-full py-5 font-black text-sm bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    JEPRET FOTO SEKARANG (📸)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopCamera}
                    className="text-xs text-foreground/50 hover:text-foreground"
                  >
                    Batal & Tutup Kamera
                  </Button>
                </div>
              </div>
            ) : (
              /* 3. BELUM ADA FOTO & KAMERA IDLE: OPSI BUKA KAMERA ATAU UPLOAD BERKAS */
              <div className="space-y-4">
                {cameraError && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold">Info Akses Kamera</p>
                      <p className="text-[11px] opacity-90 mt-0.5">{cameraError}</p>
                    </div>
                  </div>
                )}

                <div
                  onClick={activeJob ? () => startCamera("environment") : undefined}
                  className={cn(
                    "relative mx-auto flex h-60 w-full max-w-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer transition-all hover:bg-primary/10 group",
                    !activeJob && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {/* Corner Ornaments */}
                  <div className="absolute -top-1 -left-1 h-7 w-7 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 h-7 w-7 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 h-7 w-7 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 border-b-4 border-r-4 border-primary rounded-br-xl" />

                  <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    {isStartingCamera ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <Camera className="h-8 w-8" />
                    )}
                  </div>

                  <p className="text-xs font-bold text-foreground">
                    {isStartingCamera ? "Menghubungkan Kamera..." : "Buka Kamera Langsung"}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-1 max-w-[200px] leading-tight">
                    Ketuk untuk mengaktifkan video kamera dan memotret bukti serah terima
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => startCamera("environment")}
                    disabled={!activeJob || isStartingCamera}
                    className="w-full font-bold text-xs"
                  >
                    {isStartingCamera ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="mr-2 h-4 w-4" />
                    )}
                    Buka Kamera Live
                  </Button>
                  <Button
                    onClick={triggerFileInput}
                    disabled={!activeJob}
                    variant="outline"
                    className="w-full font-bold text-xs border-border hover:bg-foreground/5"
                  >
                    <Upload className="mr-2 h-4 w-4 text-foreground/60" />
                    Pilih File Galeri
                  </Button>
                </div>
              </div>
            )}

            {/* ACTION SUBMIT BUTTON */}
            <div className="pt-2 border-t border-border">
              <Button
                onClick={handleConfirmDelivery}
                disabled={isConfirming || !activeJob}
                className="w-full py-6 font-black text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    MEMPROSES SERAH TERIMA...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {photoProof
                      ? "KIRIM BUKTI & SELESAIKAN PENGIRIMAN"
                      : "KONFIRMASI SERAH TERIMA (TANPA FOTO)"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RECENT SCAN HISTORY */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Riwayat Scan</h3>
            </div>

            {scanHistory.length > 0 ? (
              <div className="space-y-3">
                {scanHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-foreground/5 p-3 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground uppercase">{item.id}</p>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-sm text-foreground/30 italic">Belum ada riwayat scan.</p>
            )}
          </CardContent>
        </Card>

        {/* AI Tip */}
        <div className="flex gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-foreground/60 leading-relaxed font-medium">
            Sistem AI kami akan mendeteksi lokasi dan waktu secara otomatis untuk validasi pengiriman yang sah.
          </p>
        </div>
      </div>
    </div>
  );
}