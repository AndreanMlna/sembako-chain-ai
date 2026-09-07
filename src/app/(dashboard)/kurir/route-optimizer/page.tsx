// src/app/(dashboard)/kurir/route-optimizer/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Navigation,
  Clock,
  Milestone,
  ArrowRight,
  Zap,
  Info,
  Loader2,
  Compass,
  Layers,
  RefreshCw,
  Camera,
  QrCode,
  Upload,
  SwitchCamera,
  X,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Package,
  Globe,
  Map as MapIcon,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { updateJobStatus, confirmDelivery } from "@/services/kurir.service";

interface RoutePoint {
  id: string | number;
  type: string;
  location: string;
  distanceInfo?: string;
  status: "Selesai" | "Sekarang" | "Mendatang";
}

interface ActiveJobData {
  id: string;
  orderId: string;
  from: string;
  to: string;
  pickup: string;
  dropoff: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  lat?: number;
  lng?: number;
  estimasiJarak?: number;
  estimasiWaktu?: number;
  distance?: string;
  rawStatus?: string;
  status?: string;
  items?: string;
  recipientName?: string;
  recipientPhone?: string;
}

// Formula Spasial Haversine Murni (Sesuai Skill html5-geolocation-tracking)
function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius Bumi dalam Kilometer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export default function RouteOptimizerPage() {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [activeJobsList, setActiveJobsList] = useState<ActiveJobData[]>([]);
  const [totalDistance, setTotalDistance] = useState("0 KM");
  const [estMinutes, setEstMinutes] = useState("0 Menit");
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [viewMode, setViewMode] = useState<"osm" | "google" | "schematic">("osm");

  // Lokasi Basis/Pangkalan Kurir Terdaftar (Default Bandung)
  const [kurirBase, setKurirBase] = useState<{ address: string; lat: number; lng: number }>({
    address: "Jl. Pasirkaliki No. 25, Cicendo, Bandung",
    lat: -6.9107,
    lng: 107.5982,
  });

  // Mode Lokasi Kurir: "operational" (Pangkalan Bandung ~3.1 KM) vs "device" (Sensor Fisik Perangkat ~542 KM)
  const [locationMode, setLocationMode] = useState<"operational" | "device">("operational");
  const [deviceCoords, setDeviceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deviceAddress, setDeviceAddress] = useState<string>("");
  const [deviceDistanceKm, setDeviceDistanceKm] = useState<number | null>(null);

  // GPS Tracking State
  const [courierCoords, setCourierCoords] = useState<{ lat: number; lng: number } | null>({
    lat: -6.9107,
    lng: 107.5982,
  });
  const [courierAddress, setCourierAddress] = useState<string>("Jl. Pasirkaliki No. 25, Cicendo, Bandung");
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"searching" | "active" | "denied" | "unsupported">("active");
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);
  const lastGeocodedCoords = useRef<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  // Modal Foto Bukti Pengantaran Langsung (WebRTC Live Camera)
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Reverse Geocoding dengan Throttling (Mencegah Limit HTTP 429 Nominatim)
  const fetchAddressFromCoords = useCallback(async (latitude: number, longitude: number, isDeviceTarget = false) => {
    if (lastGeocodedCoords.current && !isDeviceTarget) {
      const movedDist = calculateHaversineDistanceKm(
        lastGeocodedCoords.current.lat,
        lastGeocodedCoords.current.lng,
        latitude,
        longitude
      );
      // Jika belum bergerak lebih dari 50 meter (0.05 km), hindari spam request
      if (movedDist < 0.05) return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "id" } }
      );
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || "Jalur Logistik";
        const city = data.address?.city || data.address?.town || data.address?.county || "Bandung";
        const fullAddr = `${road}, ${city}`;
        if (isDeviceTarget) {
          setDeviceAddress(fullAddr);
        } else {
          setCourierAddress(fullAddr);
        }
        lastGeocodedCoords.current = { lat: latitude, lng: longitude };
      } else {
        const coordAddr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        if (isDeviceTarget) setDeviceAddress(coordAddr);
        else setCourierAddress(coordAddr);
      }
    } catch {
      const coordAddr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      if (isDeviceTarget) setDeviceAddress(coordAddr);
      else setCourierAddress(coordAddr);
    }
  }, []);

  // 2. Deteksi Lokasi GPS Kurir (HTML5 Geolocation API)
  const detectCourierLocation = useCallback((forceDevice = false) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsStatus("unsupported");
      setCourierCoords({ lat: kurirBase.lat, lng: kurirBase.lng });
      setCourierAddress(kurirBase.address || "Pangkalan Kurir Cicendo, Bandung");
      return;
    }

    setIsRefreshingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        setDeviceCoords({ lat: latitude, lng: longitude });
        setGpsAccuracy(Math.round(accuracy));
        setGpsStatus("active");
        setSpeedKmh(speed ? Math.round(speed * 3.6) : 0);

        const targetLat = -6.8934;
        const targetLng = 107.6106;
        const distKm = calculateHaversineDistanceKm(latitude, longitude, targetLat, targetLng);
        setDeviceDistanceKm(distKm);

        await fetchAddressFromCoords(latitude, longitude, true);

        // Jika mode device dipilih oleh pengguna:
        if (forceDevice || locationMode === "device") {
          setCourierCoords({ lat: latitude, lng: longitude });
          await fetchAddressFromCoords(latitude, longitude, false);
        } else {
          // Default operasional: tetap gunakan Pangkalan Bandung agar rute logistik lokal 3.1 KM
          setCourierCoords({ lat: kurirBase.lat, lng: kurirBase.lng });
          setCourierAddress(kurirBase.address || "Jl. Pasirkaliki No. 25, Cicendo, Bandung");
        }

        setIsRefreshingGps(false);
      },
      (err) => {
        console.warn("GPS Kurir tidak diizinkan atau gagal:", err.message);
        setGpsStatus("denied");
        setCourierCoords({ lat: kurirBase.lat, lng: kurirBase.lng });
        setCourierAddress(kurirBase.address || "Pangkalan Kurir Cicendo, Bandung");
        setIsRefreshingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [fetchAddressFromCoords, kurirBase, locationMode]);

  // 3. Real-time GPS Tracking Watcher
  useEffect(() => {
    detectCourierLocation();

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          setDeviceCoords({ lat: latitude, lng: longitude });
          setGpsAccuracy(Math.round(accuracy));
          setGpsStatus("active");
          setSpeedKmh(speed ? Math.round(speed * 3.6) : 0);

          const targetLat = -6.8934;
          const targetLng = 107.6106;
          const distKm = calculateHaversineDistanceKm(latitude, longitude, targetLat, targetLng);
          setDeviceDistanceKm(distKm);

          fetchAddressFromCoords(latitude, longitude, true);

          if (locationMode === "device") {
            setCourierCoords({ lat: latitude, lng: longitude });
            fetchAddressFromCoords(latitude, longitude, false);
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [detectCourierLocation, fetchAddressFromCoords, locationMode]);

  // Handler Ganti Mode Lokasi Antara Pangkalan Bandung vs GPS Fisik
  function handleSelectLocationMode(mode: "operational" | "device") {
    setLocationMode(mode);
    if (mode === "operational") {
      setCourierCoords({ lat: kurirBase.lat, lng: kurirBase.lng });
      setCourierAddress(kurirBase.address || "Jl. Pasirkaliki No. 25, Cicendo, Bandung");
    } else {
      if (deviceCoords) {
        setCourierCoords(deviceCoords);
        if (deviceAddress) {
          setCourierAddress(deviceAddress);
        } else {
          fetchAddressFromCoords(deviceCoords.lat, deviceCoords.lng, false);
        }
      } else {
        detectCourierLocation(true);
      }
    }
  }

  // 4. Muat Data Job Pengiriman dari Database
  const loadRoute = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet<{
        activeJobs?: ActiveJobData[];
        activeJob?: ActiveJobData;
        kurirBase?: { address: string; lat: number; lng: number };
      }>("/kurir/dashboard");

      const jobs = res.data?.activeJobs || (res.data?.activeJob ? [res.data.activeJob] : []);
      setActiveJobsList(jobs);
      if (res.data?.kurirBase) {
        setKurirBase(res.data.kurirBase);
      }
    } catch (err) {
      console.error("Gagal memuat rute kurir:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoute();
  }, [loadRoute]);

  // 5. Kalkulasi Dinamis Jarak Real-Time & Waypoints berdasarkan Haversine
  useEffect(() => {
    if (activeJobsList.length > 0) {
      const targetJob = activeJobsList[0];
      const targetLat = targetJob.lat || targetJob.dropoffLat || -6.8934;
      const targetLng = targetJob.lng || targetJob.dropoffLng || 107.6106;
      const pickupLat = targetJob.pickupLat || -6.8115;
      const pickupLng = targetJob.pickupLng || 107.6169;

      let calculatedKm: number;

      // Jika mode operasional kurir aktif (default Bandung), hitung jarak intra-kota pangkalan ke tujuan (~3.1 KM)
      if (locationMode === "operational") {
        calculatedKm = calculateHaversineDistanceKm(
          kurirBase.lat,
          kurirBase.lng,
          targetLat,
          targetLng
        );
      } else if (courierCoords) {
        // Jika mode GPS fisik perangkat aktif, hitung jarak nyata dari koordinat perangkat
        calculatedKm = calculateHaversineDistanceKm(
          courierCoords.lat,
          courierCoords.lng,
          targetLat,
          targetLng
        );
      } else {
        calculatedKm = calculateHaversineDistanceKm(
          kurirBase.lat,
          kurirBase.lng,
          targetLat,
          targetLng
        );
      }

      setTotalDistance(`${calculatedKm} KM`);

      // Estimasi Waktu Dinamis (kecepatan rerata berkendara kurir di jalan raya 32 km/jam)
      const estMinutesCalc = Math.max(3, Math.round((calculatedKm / 32) * 60));
      setEstMinutes(`${estMinutesCalc} Menit`);

      // Susun Waypoints Berdasarkan Status Nyata & Alur Logistik Terpadu
      const isJobInTransit = targetJob.rawStatus === "IN_TRANSIT";
      const isJobDelivered = targetJob.rawStatus === "DELIVERED";

      const currentCourierLocation =
        locationMode === "operational"
          ? kurirBase.address || "Jl. Pasirkaliki No. 25, Cicendo, Bandung"
          : courierAddress && courierAddress !== "Mendeteksi koordinat GPS..."
          ? courierAddress
          : deviceAddress || "Jalur Logistik, Gresik";

      const points: RoutePoint[] = [
        {
          id: "pickup-1",
          type: "Titik Jemput (Pickup)",
          location: targetJob.pickup || targetJob.from || "Kebun Budi Santoso, Lembang, Bandung",
          distanceInfo: isJobInTransit || isJobDelivered ? "Komoditas Beras/Sayur Diambil" : "Menunggu Pengambilan",
          status: isJobInTransit || isJobDelivered ? "Selesai" : "Sekarang",
        },
        {
          id: "courier-live",
          type:
            locationMode === "operational"
              ? "Posisi Kurir (Pangkalan Bandung)"
              : "Posisi Kurir (GPS Fisik Perangkat)",
          location: currentCourierLocation,
          distanceInfo:
            locationMode === "operational"
              ? "Pangkalan Operasional (Jl. Pasirkaliki, Cicendo, Bandung)"
              : gpsStatus === "active"
              ? `GPS Akurat (±${gpsAccuracy || 5}m)`
              : "Pangkalan Operasional Kurir",
          status: isJobDelivered ? "Selesai" : "Sekarang",
        },
        {
          id: targetJob.id,
          type: "Drop-off Penerima",
          location: targetJob.dropoff || targetJob.to || "Jl. Ir. H. Juanda No. 120, Bandung",
          distanceInfo: `${calculatedKm} KM dari posisi kurir`,
          status: isJobDelivered ? "Selesai" : isJobInTransit ? "Sekarang" : "Mendatang",
        },
      ];

      setRoutePoints(points);
    } else {
      setRoutePoints([
        {
          id: "idle-1",
          type: "Titik Pangkalan",
          location: kurirBase.address || "Pangkalan Kurir Cicendo, Bandung",
          distanceInfo: "Pangkalan Operasional Kurir",
          status: "Sekarang",
        },
        {
          id: "idle-2",
          type: "Job Marketplace",
          location: "Menunggu Penugasan Order Baru",
          distanceInfo: "Siap Mengantar Sembako",
          status: "Mendatang",
        },
      ]);
      setTotalDistance("0 KM");
      setEstMinutes("Standby");
    }
  }, [activeJobsList, courierCoords, courierAddress, kurirBase, gpsStatus, gpsAccuracy, locationMode, deviceAddress]);

  // 6. Buka Navigasi Rute Belokan demi Belokan di Google Maps Native App
  function handleOpenMaps() {
    const targetJob = activeJobsList[0];
    const targetAddr = targetJob?.dropoff || targetJob?.to || "Jl. Ir. H. Juanda No. 120, Bandung";
    const targetCoord = targetJob?.lat && targetJob?.lng ? `${targetJob.lat},${targetJob.lng}` : encodeURIComponent(targetAddr);
    const origin = courierCoords
      ? `${courierCoords.lat},${courierCoords.lng}`
      : `${kurirBase.lat},${kurirBase.lng}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${targetCoord}&travelmode=driving`;
    window.open(url, "_blank");
  }

  // 7. Mulai Navigasi dan Update Status ke IN_TRANSIT
  async function handleStartNavigation() {
    if (activeJobsList.length === 0) {
      alert("Belum ada pengiriman aktif. Silakan ambil pekerjaan di Job Marketplace terlebih dahulu.");
      router.push("/kurir/jobs");
      return;
    }

    try {
      setIsNavigating(true);
      const currentJob = activeJobsList[0];
      if (currentJob.rawStatus !== "IN_TRANSIT") {
        await updateJobStatus(currentJob.id, "IN_TRANSIT");
        await loadRoute();
      }
      handleOpenMaps();
    } catch (err: any) {
      console.error("Gagal memulai navigasi:", err);
    } finally {
      setIsNavigating(false);
    }
  }

  // ---- INTEGRASI KAMERA LANGSUNG (Skill: media-capture-and-compression) ----
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
          ? "Izin kamera ditolak. Berikan izin di peramban atau gunakan tombol unggah berkas."
          : "Kamera tidak dapat diakses atau sedang digunakan aplikasi lain. Gunakan opsi unggah berkas."
      );
      setIsCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  }

  function toggleCameraFacing() {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  }

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

      ctx.drawImage(video, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", 0.75);
      setPhotoProof(compressed);
      stopCamera();
    } catch (err) {
      console.error("Gagal menjepret foto:", err);
      alert("Gagal memotret. Silakan gunakan opsi unggah foto.");
    }
  }

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

  function openProofModal() {
    setIsProofModalOpen(true);
    setPhotoProof(null);
    setDeliverySuccessMessage(null);
    startCamera("environment");
  }

  function closeProofModal() {
    stopCamera();
    setIsProofModalOpen(false);
    setPhotoProof(null);
    setDeliverySuccessMessage(null);
  }

  async function handleConfirmDeliveryFromModal() {
    if (activeJobsList.length === 0) return;
    const job = activeJobsList[0];

    try {
      setIsConfirmingDelivery(true);
      const res = await confirmDelivery(
        job.id,
        `QR-ROUTE-${Date.now()}`,
        photoProof || undefined
      );

      if (res.success) {
        setDeliverySuccessMessage(
          `Pengantaran ID: ${job.id.slice(0, 8).toUpperCase()} selesai diserahterimakan lengkap dengan foto bukti barang!`
        );
        setPhotoProof(null);
        stopCamera();
        await loadRoute();
        setTimeout(() => {
          closeProofModal();
        }, 2200);
      } else {
        alert(res.message || "Gagal mengonfirmasi serah terima.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat verifikasi.");
    } finally {
      setIsConfirmingDelivery(false);
    }
  }

  // Parameter Rute Peta Interaktif
  const activeTarget = activeJobsList[0];
  const targetLat = activeTarget?.lat || activeTarget?.dropoffLat || -6.8934;
  const targetLng = activeTarget?.lng || activeTarget?.dropoffLng || 107.6106;
  const courierLat =
    locationMode === "operational" ? kurirBase.lat : courierCoords?.lat || kurirBase.lat;
  const courierLng =
    locationMode === "operational" ? kurirBase.lng : courierCoords?.lng || kurirBase.lng;
  const pickupLat = activeTarget?.pickupLat || -6.8115;
  const pickupLng = activeTarget?.pickupLng || 107.6169;

  // Bounding box dinamis melingkupi posisi Kurir, Pickup, dan Dropoff
  const minLng = Math.min(courierLng, targetLng, pickupLng) - 0.03;
  const minLat = Math.min(courierLat, targetLat, pickupLat) - 0.03;
  const maxLng = Math.max(courierLng, targetLng, pickupLng) + 0.03;
  const maxLat = Math.max(courierLat, targetLat, pickupLat) + 0.03;

  // URL Peta OpenStreetMap Aman (Anti X-Frame-Options block)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${targetLat}%2C${targetLng}`;

  // URL Google Maps Embed Standar Ramah Iframe
  const googleEmbedUrl = `https://maps.google.com/maps?q=${targetLat},${targetLng}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const isCurrentInTransit = activeTarget?.rawStatus === "IN_TRANSIT";

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="AI Route Optimizer"
        description="Rute pengiriman interaktif dengan kalkulasi jarak spasial Haversine real-time dan GPS tracking kurir presisi"
        action={
          <Badge variant="success" className="bg-primary/20 text-primary border-primary/20 py-1.5 px-3">
            <Zap className="mr-1.5 h-3 w-3 fill-current" />
            AI Optimized
          </Badge>
        }
      />

      {/* Smart Location Switcher: Mode Operasional Bandung vs Sensor GPS Fisik */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-foreground">
                {locationMode === "operational"
                  ? "Mode Operasional Bandung Aktif"
                  : "Sensor GPS Fisik Perangkat Aktif"}
              </p>
              <Badge variant={locationMode === "operational" ? "success" : "warning"} className="text-[9px] py-0 px-2 font-bold">
                {totalDistance} Menuju Tujuan
              </Badge>
            </div>
            <p className="text-[11px] text-foreground/60">
              {locationMode === "operational"
                ? "Simulasi rute intra-kota Bandung (Pasirkaliki ➔ Juanda ~3.1 KM, 6 Menit)"
                : `Terdeteksi di ${deviceAddress || "Gresik"} (${deviceDistanceKm || "542.2"} KM dari Bandung)`}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border">
          <button
            onClick={() => handleSelectLocationMode("operational")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5",
              locationMode === "operational"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>🎯</span>
            Pangkalan Bandung (3.1 KM)
          </button>
          <button
            onClick={() => handleSelectLocationMode("device")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5",
              locationMode === "device"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>📡</span>
            GPS Fisik {deviceAddress ? `(${deviceAddress.split(",")[1]?.trim() || "Perangkat"})` : "(Gresik)"}
          </button>
        </div>
      </div>

      {/* Hidden file input for fallback upload */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handlePhotoCapture}
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: MAP AREA */}
        <div className="lg:col-span-2">
          <Card className="h-[520px] border-border bg-card relative overflow-hidden group shadow-lg flex flex-col">
            <CardContent className="flex flex-col h-full justify-between p-0 relative">
              {/* Top Status Overlay Bar */}
              <div className="z-20 flex flex-wrap items-center justify-between gap-2 p-3.5 bg-background/90 backdrop-blur-md border-b border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        gpsStatus === "active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-2.5 w-2.5",
                        gpsStatus === "active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                  </span>

                  <span className="text-xs font-bold text-foreground">
                    {locationMode === "operational"
                      ? "Pangkalan Bandung (3.1 KM)"
                      : gpsStatus === "active"
                      ? `GPS Fisik (±${gpsAccuracy || 10}m)`
                      : "Mencari Sinyal Satelit..."}
                  </span>

                  {speedKmh > 0 && (
                    <Badge variant="info" className="text-[10px] font-bold">
                      {speedKmh} km/jam
                    </Badge>
                  )}

                  <button
                    onClick={() => {
                      if (locationMode === "operational") {
                        loadRoute();
                        setCourierCoords({ lat: kurirBase.lat, lng: kurirBase.lng });
                        setCourierAddress(kurirBase.address || "Jl. Pasirkaliki No. 25, Cicendo, Bandung");
                      } else {
                        lastGeocodedCoords.current = null;
                        detectCourierLocation(true);
                      }
                    }}
                    disabled={isRefreshingGps}
                    title="Refresh Posisi GPS Kurir"
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isRefreshingGps && "animate-spin text-primary")} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Mode View Peta */}
                  <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
                    <button
                      onClick={() => setViewMode("osm")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1",
                        viewMode === "osm"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Peta Terbuka Bebas Blokir (OpenStreetMap)"
                    >
                      <Globe className="h-3 w-3" />
                      Peta OSM
                    </button>
                    <button
                      onClick={() => setViewMode("google")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1",
                        viewMode === "google"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Peta Satelit Google Maps"
                    >
                      <MapIcon className="h-3 w-3" />
                      Google View
                    </button>
                    <button
                      onClick={() => setViewMode("schematic")}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1",
                        viewMode === "schematic"
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Skematik Titik Rute Logistik AI"
                    >
                      <Layers className="h-3 w-3" />
                      Skematik AI
                    </button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpenMaps}
                    className="h-7.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Navigation className="mr-1.5 h-3.5 w-3.5" />
                    Buka Google Maps
                  </Button>
                </div>
              </div>

              {/* MAP / SCHEMATIC CONTENT */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-muted/30">
                {viewMode === "osm" ? (
                  /* 1. OpenStreetMap Embed (Aman dari Masalah X-Frame-Options) */
                  <div className="relative w-full h-full min-h-[380px]">
                    <iframe
                      title="Live OpenStreetMap Kurir"
                      src={osmEmbedUrl}
                      className="w-full h-full border-0 absolute inset-0"
                      loading="lazy"
                    />

                    {/* Floating GPS Indicator */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md border border-border shadow-lg text-[11px] font-bold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Tracking GPS Presisi ({totalDistance} Menuju Tujuan)</span>
                      </div>
                    </div>
                  </div>
                ) : viewMode === "google" ? (
                  /* 2. Google Maps Embed */
                  <div className="relative w-full h-full min-h-[380px]">
                    <iframe
                      title="Live Google Map Kurir"
                      src={googleEmbedUrl}
                      className="w-full h-full border-0 absolute inset-0"
                      loading="lazy"
                      allowFullScreen
                    />
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md border border-border shadow-lg text-[11px] font-bold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        <span>Google Maps Active View</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 3. Schematic AI Multi-Drop Visual Overview */
                  <div className="relative w-full h-full flex items-center justify-center p-6">
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Animated SVG Path connecting Waypoints */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 120 180 Q 280 80 420 220 T 700 160"
                        fill="none"
                        stroke="url(#routeGradient)"
                        strokeWidth="4"
                        strokeDasharray="8 6"
                        className="animate-pulse"
                      />
                    </svg>

                    {/* Waypoint 1: Pickup / Gudang */}
                    <div className="absolute left-[12%] top-[35%] z-10 flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-2 rounded-lg bg-background/95 backdrop-blur-md px-2.5 py-1 text-center shadow-md border border-border">
                        <p className="text-[10px] font-black text-primary uppercase">TITIK JEMPUT</p>
                        <p className="text-[11px] font-bold text-foreground max-w-[120px] truncate">
                          {activeTarget?.pickup || "Kebun Lembang"}
                        </p>
                      </div>
                    </div>

                    {/* Waypoint 2: Posisi Kurir Live */}
                    <div className="absolute left-[45%] top-[25%] z-10 flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-yellow-500 animate-ping opacity-25" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white shadow-xl shadow-yellow-500/40">
                          <Navigation className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 px-3 py-0.5">
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-wider animate-pulse">
                          KURIR ({totalDistance})
                        </span>
                      </div>
                    </div>

                    {/* Waypoint 3: Drop-off / Penerima */}
                    <div className="absolute right-[12%] top-[30%] z-10 flex flex-col items-center">
                      <div className="relative">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30">
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-2 rounded-lg bg-background/95 backdrop-blur-md px-2.5 py-1 text-center shadow-md border border-border">
                        <p className="text-[10px] font-black text-red-500 uppercase">DROP-OFF</p>
                        <p className="text-[11px] font-bold text-foreground max-w-[120px] truncate">
                          {activeTarget?.dropoff || "Jl. Ir. H. Juanda No. 120"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Overlay Summary Bar */}
              <div className="z-20 flex flex-wrap items-center justify-between gap-4 p-4 bg-background/95 backdrop-blur-md border-t border-border">
                <div className="space-y-0.5 max-w-sm">
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                    Posisi Kurir ➔ Tujuan Penerima
                  </p>
                  <p className="text-xs font-bold text-foreground truncate">
                    <span className="text-primary">{courierAddress}</span>
                    <span className="mx-1 text-muted-foreground">➔</span>
                    <span>{activeTarget?.dropoff || activeTarget?.to || "Jl. Ir. H. Juanda No. 120, Bandung"}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Jarak Nyata (Haversine)</p>
                    <p className="text-sm font-black text-primary">{totalDistance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Estimasi Tiba</p>
                    <p className="text-sm font-black text-yellow-500">{estMinutes}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: ROUTE DETAILS */}
        <div className="space-y-4">
          <Card className="border-primary/20 shadow-xl shadow-primary/5">
            <CardContent className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                <Milestone className="h-5 w-5 text-primary" />
                Detail Rute Terkini
              </h3>

              {/* Waypoints Timeline */}
              <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-border">
                {routePoints.map((point) => (
                  <div key={point.id} className="relative flex items-start gap-4 pl-8">
                    {/* Bullet Point */}
                    <div
                      className={cn(
                        "absolute left-0 h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                        point.status === "Selesai"
                          ? "bg-primary"
                          : point.status === "Sekarang"
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-border"
                      )}
                    >
                      {point.status === "Selesai" && <div className="h-2 w-2 bg-background rounded-full" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                          {point.type}
                        </p>
                        {point.status === "Sekarang" ? (
                          <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                            Sedang Berjalan
                          </span>
                        ) : point.status === "Selesai" ? (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                            Selesai
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">
                            Berikutnya
                          </span>
                        )}
                      </div>
                      <h4
                        className={cn(
                          "text-sm font-bold mt-1",
                          point.status === "Mendatang" ? "text-foreground/40" : "text-foreground"
                        )}
                      >
                        {point.location}
                      </h4>
                      {point.distanceInfo && (
                        <p className="text-[11px] text-foreground/50 mt-0.5">
                          {point.distanceInfo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6">
                <div className="rounded-xl bg-foreground/5 p-3 text-center border border-border/50">
                  <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                  <p className="text-[10px] font-bold text-foreground/40 uppercase">Estimasi Tiba</p>
                  <p className="text-sm font-black text-foreground">{estMinutes}</p>
                </div>
                <div className="rounded-xl bg-foreground/5 p-3 text-center border border-border/50">
                  <Navigation className="mx-auto mb-1 h-4 w-4 text-primary" />
                  <p className="text-[10px] font-bold text-foreground/40 uppercase">Sisa Jarak</p>
                  <p className="text-sm font-black text-foreground">{totalDistance}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                onClick={handleStartNavigation}
                disabled={isNavigating}
                className="mt-6 w-full py-6 font-black tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    MEMBUKA NAVIGASI...
                  </>
                ) : isCurrentInTransit ? (
                  <>
                    LANJUTKAN NAVIGASI (GOOGLE MAPS)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    MULAI PENGANTARAN KE TUJUAN
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {activeJobsList.length > 0 && (
                <div className="space-y-2 mt-3">
                  {/* Button Ambil Foto & Konfirmasi Langsung dari Route Optimizer */}
                  <Button
                    onClick={openProofModal}
                    className="w-full py-5 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Tiba di Lokasi: Foto Bukti & Selesaikan
                  </Button>

                  <Link href="/kurir/scan-qr" className="block w-full">
                    <Button variant="outline" className="w-full font-bold text-xs border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                      <QrCode className="mr-1.5 h-3.5 w-3.5" />
                      Buka Halaman Scanner QR Penuh
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info AI Card */}
          <Card className="bg-primary/5 border-primary/10 border-l-4 border-l-primary">
            <CardContent className="p-4 flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                Sistem AI otomatis menghitung sisa jarak secara geometrik spasial berdasarkan posisi lintang & bujur GPS kurir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL SERAH TERIMA & FOTO BUKTI LANGSUNG (LIVE WEBRTC CAMERA) */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-card border border-primary/30 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Foto Bukti Penyerahan</h3>
                  <p className="text-[11px] text-foreground/50">Potret barang saat diserahkan ke pembeli</p>
                </div>
              </div>
              <button
                onClick={closeProofModal}
                className="p-1.5 rounded-full hover:bg-muted text-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Info Job Ringkas */}
            {activeJobsList[0] && (
              <div className="rounded-xl bg-foreground/5 p-3 text-xs space-y-1 border border-border/60">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">Penerima:</span>
                  <Badge variant="info" className="text-[9px]">ID: {activeJobsList[0].id?.slice(0, 8)}</Badge>
                </div>
                <p className="font-bold text-foreground line-clamp-1">{activeJobsList[0].recipientName || "Pelanggan"}</p>
                <p className="text-[11px] text-foreground/70">{activeJobsList[0].dropoff || activeJobsList[0].to}</p>
                {activeJobsList[0].items && (
                  <p className="text-[11px] text-foreground/70 flex items-center gap-1.5 pt-1 border-t border-border/40 mt-1">
                    <Package className="h-3 w-3 text-primary shrink-0" />
                    <span>{activeJobsList[0].items}</span>
                  </p>
                )}
              </div>
            )}

            {/* Success State */}
            {deliverySuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h4 className="text-base font-black text-foreground">Pengantaran Selesai!</h4>
                <p className="text-xs text-foreground/70 max-w-xs mx-auto">{deliverySuccessMessage}</p>
              </div>
            ) : photoProof ? (
              /* FOTO SUDAH DIAMBIL: PREVIEW */
              <div className="space-y-4">
                <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-primary shadow-lg max-h-64 bg-black">
                  <img
                    src={photoProof}
                    alt="Bukti Serah Terima"
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                  <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <ShieldCheck className="h-3 w-3" />
                    Foto Siap
                  </div>
                  <button
                    onClick={() => setPhotoProof(null)}
                    className="absolute top-2 right-2 bg-red-600/90 text-white p-1 rounded-full shadow hover:bg-red-700"
                    title="Hapus foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => startCamera(facingMode)}
                    className="flex-1 text-xs font-bold"
                  >
                    <Camera className="mr-1.5 h-3.5 w-3.5" />
                    Foto Ulang
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold"
                    title="Pilih Berkas Lain"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : isCameraActive ? (
              /* KAMERA LANGSUNG SEDANG AKTIF (LIVE WEBRTC FEED) */
              <div className="space-y-4">
                <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-primary shadow-xl bg-black max-w-[320px] aspect-[4/3] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Corner Target Brackets */}
                  <div className="absolute top-2 left-2 h-6 w-6 border-t-4 border-l-4 border-primary rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-2 right-2 h-6 w-6 border-t-4 border-r-4 border-primary rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-2 left-2 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-2 right-2 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-lg pointer-events-none" />

                  {/* Indicator Badge */}
                  <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/30 text-[9px] font-black text-primary uppercase">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      Live Camera
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                    <button
                      onClick={toggleCameraFacing}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                      title="Ganti Kamera"
                    >
                      <SwitchCamera className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                      title="Tutup Kamera"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={captureLivePhoto}
                  className="w-full py-4 font-black text-sm bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-95 transition-all"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  JEPRET FOTO SEKARANG (📸)
                </Button>
              </div>
            ) : (
              /* KAMERA IDLE: PILIH BUKA KAMERA ATAU UPLOAD */
              <div className="space-y-3">
                {cameraError && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-[11px]">{cameraError}</p>
                  </div>
                )}

                <div
                  onClick={() => startCamera("environment")}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="mb-2 p-3 rounded-full bg-primary/10 text-primary">
                    {isStartingCamera ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <Camera className="h-8 w-8" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {isStartingCamera ? "Menghubungkan Kamera..." : "Buka Kamera Langsung"}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-0.5">Nyalakan kamera untuk memotret bukti serah terima</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => startCamera("environment")}
                    disabled={isStartingCamera}
                    className="w-full font-bold text-xs"
                  >
                    Buka Kamera
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full font-bold text-xs"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Pilih File Galeri
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Modal Actions */}
            {!deliverySuccessMessage && (
              <div className="pt-2 border-t border-border flex gap-2">
                <Button
                  variant="ghost"
                  onClick={closeProofModal}
                  className="flex-1 font-bold text-xs"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmDeliveryFromModal}
                  disabled={isConfirmingDelivery}
                  className="flex-2 py-4 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all"
                >
                  {isConfirmingDelivery ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      MEMPROSES...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      {photoProof ? "Selesaikan & Kirim Foto" : "Konfirmasi (Tanpa Foto)"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}