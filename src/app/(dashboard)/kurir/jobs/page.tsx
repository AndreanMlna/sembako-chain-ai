"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Package, ArrowRight, Filter, Navigation, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SearchBar from "@/components/shared/SearchBar";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { cn, formatRupiah } from "@/lib/utils";
import { getAvailableJobs, acceptJob } from "@/services/kurir.service";

interface JobItem {
  id: string;
  rawId: string;
  store: string;
  item: string;
  pickup: string;
  dropoff: string;
  distance: string;
  fee: number;
  urgent: boolean;
}

export default function JobMarketplacePage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await getAvailableJobs();
        if (res.success && Array.isArray(res.data)) {
          const mapped: JobItem[] = res.data.map((job: any, index: number) => {
            const pembeli = job.order?.pembeli;
            const items = job.order?.items || [];
            const itemList = items
              .map((i: any) => `${i.jumlah} ${i.produk?.nama || "Barang"}`)
              .join(", ") || "Paket Pangan Sembako";

            return {
              id: `JOB-${job.id.slice(0, 6).toUpperCase()}`,
              rawId: job.id,
              store: pembeli?.nama ? `Pesanan ${pembeli.nama}` : "Pemesanan Pangan",
              item: itemList,
              pickup: "Sentra Pangan / Petani Terdaftar",
              dropoff: job.order?.alamatPengiriman || (pembeli?.jalan ? `${pembeli.jalan}, ${pembeli.kecamatan || ""}` : "Tujuan Pengantaran"),
              distance: job.estimasiJarak ? `${job.estimasiJarak} km` : "4.0 km",
              fee: job.ongkosKirim || 25000,
              urgent: index % 2 === 0,
            };
          });
          setJobs(mapped);
        }
      } catch (err) {
        console.error("Gagal mengambil daftar job kurir:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, []);

  async function handleTakeJob(job: JobItem) {
    try {
      setAcceptingId(job.rawId);
      const res = await acceptJob(job.rawId);
      if (res.success) {
        router.push("/kurir/route-optimizer");
      } else {
        alert(res.message || "Gagal mengambil pekerjaan.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat mengambil pekerjaan.");
    } finally {
      setAcceptingId(null);
    }
  }

  const [filterUrgent, setFilterUrgent] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(false);

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.dropoff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.item.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUrgent = filterUrgent ? job.urgent : true;
      return matchesSearch && matchesUrgent;
    })
    .sort((a, b) => {
      if (!sortByNearest) return 0;
      const distA = parseFloat(a.distance) || 0;
      const distB = parseFloat(b.distance) || 0;
      return distA - distB;
    });

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Job Marketplace"
        description="Temukan dan ambil pekerjaan pengiriman yang tersedia di sekitar Anda"
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari berdasarkan area pickup atau dropoff..."
            onSearch={(q) => setSearchQuery(q)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilterUrgent(!filterUrgent)}
            className={cn("h-11 border-border bg-card transition-colors", filterUrgent && "bg-primary/10 border-primary text-primary font-bold")}
          >
            <Filter className="mr-2 h-4 w-4" />
            {filterUrgent ? "Urgent Saja" : "Semua Job"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setSortByNearest(!sortByNearest)}
            className={cn("h-11 border-border bg-card transition-colors", sortByNearest && "bg-primary/10 border-primary text-primary font-bold")}
          >
            <Navigation className="mr-2 h-4 w-4" />
            {sortByNearest ? "Terdekat (Aktif)" : "Terdekat"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={cn(
                "group border-border hover:border-primary/50 transition-all bg-card overflow-hidden",
                job.urgent && "border-l-4 border-l-red-500"
              )}
            >
              <CardContent className="p-0">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.id}</span>
                        {job.urgent && <Badge variant="danger" className="text-[9px] px-1.5 h-4">URGENT</Badge>}
                      </div>
                      <h3 className="text-base font-bold text-foreground leading-tight">{job.store}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">{formatRupiah(job.fee)}</p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Ongkos Kirim</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-foreground/5 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Muatan:</p>
                      <p className="text-sm font-bold text-foreground">{job.item}</p>
                    </div>
                  </div>

                  <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:h-10 before:w-0.5 before:bg-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
                      <p className="text-xs text-foreground/60 leading-tight">
                        <span className="font-bold text-foreground">Pickup:</span> {job.pickup}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full border-2 border-red-500 bg-background z-10" />
                      <p className="text-xs text-foreground/60 leading-tight">
                        <span className="font-bold text-foreground">Dropoff:</span> {job.dropoff}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-foreground/[0.02] px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">{job.distance}</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={acceptingId === job.rawId}
                    onClick={() => handleTakeJob(job)}
                    className="font-black px-6 shadow-lg shadow-primary/10"
                  >
                    {acceptingId === job.rawId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        MEMPROSES...
                      </>
                    ) : (
                      <>
                        AMBIL JOB
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="Briefcase"
          title="Belum ada job tersedia"
          description={
            searchQuery
              ? `Tidak ada order pengiriman yang cocok dengan "${searchQuery}".`
              : "Saat ini belum ada order baru yang menunggu kurir. Job baru akan muncul secara otomatis di sini."
          }
        />
      )}
    </div>
  );
}