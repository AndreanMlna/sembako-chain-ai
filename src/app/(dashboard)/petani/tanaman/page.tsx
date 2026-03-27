"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Eye, Edit, Trash2, Wheat, Calendar, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { getTanamanList, type Tanaman } from "@/services/petani.service";
import { toast } from "react-hot-toast";

export default function TanamanPage() {
  const router = useRouter();
  const [tanaman, setTanaman] = useState<Tanaman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTanaman = async () => {
    try {
      const response = await getTanamanList();
      if (response.success && response.data) {
        setTanaman(response.data);
      } else {
        toast.error(response.message || "Gagal memuat data tanaman");
      }
    } catch (error) {
      console.error("Error fetching tanaman:", error);
      toast.error("Gagal memuat data tanaman");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTanaman();
  }, []);

  const filteredTanaman = tanaman.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lahan?.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SEHAT":
        return <Badge variant="success">Sehat</Badge>;
      case "SIAP_PANEN":
        return <Badge variant="warning">Siap Panen</Badge>;
      case "PANEN":
        return <Badge variant="info">Panen</Badge>;
      case "MATI":
        return <Badge variant="destructive">Mati</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-400">Memuat data tanaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="mb-8">
          <PageHeader
            title="Kelola Tanaman"
            description="Pantau dan kelola semua tanaman Anda"
            action={
              <Button
                onClick={() => router.push("/petani/tanaman/tambah")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tanaman
              </Button>
            }
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Cari tanaman atau lahan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="SEHAT">Sehat</SelectItem>
              <SelectItem value="SIAP_PANEN">Siap Panen</SelectItem>
              <SelectItem value="PANEN">Panen</SelectItem>
              <SelectItem value="MATI">Mati</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tanaman Grid */}
        {filteredTanaman.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTanaman.map((item) => (
              <Card key={item.id} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-primary/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wheat className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                          {item.nama}
                        </CardTitle>
                        <p className="text-sm text-slate-400">
                          {item.lahan?.nama || "Lahan tidak ditemukan"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {formatDate(item.tanggalTanam)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {item.lahan?.lokasi || "Lokasi tidak tersedia"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/petani/tanaman/${item.id}`)}
                      className="flex-1 border-slate-600 hover:border-primary hover:text-primary"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/petani/tanaman/${item.id}/edit`)}
                      className="flex-1 border-slate-600 hover:border-blue-500 hover:text-blue-400"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wheat className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {searchTerm || statusFilter !== "all" ? "Tidak ada tanaman yang sesuai filter" : "Belum ada tanaman"}
            </h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Coba ubah filter pencarian atau status untuk menemukan tanaman yang Anda cari."
                : "Mulai tambah tanaman pertama Anda untuk memulai pertanian."
              }
            </p>
            {(!searchTerm && statusFilter === "all") && (
              <Button
                onClick={() => router.push("/petani/tanaman/tambah")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tanaman Pertama
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
