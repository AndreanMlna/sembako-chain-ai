"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Eye, Edit, Trash2, Wheat, Calendar, MapPin, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { getTanamanList, type Tanaman } from "@/services/petani.service";
import { toast } from "react-hot-toast";

// PERBAIKAN: Definisikan tipe lokal yang menyertakan relasi lahan agar TS tidak protes
type TanamanWithLahan = Tanaman & {
    lahan?: {
        nama: string;
        lokasi: string;
    }
};

export default function TanamanPage() {
    const router = useRouter();
    // Gunakan tipe baru di sini
    const [tanaman, setTanaman] = useState<TanamanWithLahan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchTanaman = async () => {
        try {
            const response = await getTanamanList();
            if (response.success && response.data) {
                // Cast response data ke tipe yang memiliki relasi lahan
                setTanaman(response.data as TanamanWithLahan[]);
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
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "SEHAT" && item.statusKesehatan === "SEHAT") ||
            (statusFilter === "SIAP_PANEN" && item.statusPanen === "SIAP_PANEN") ||
            (statusFilter === "PANEN" && item.statusPanen === "DIPANEN") ||
            (statusFilter === "MATI" && item.statusKesehatan === "SAKIT");
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (item: TanamanWithLahan) => {
        if (item.statusPanen === "SIAP_PANEN") {
            return <Badge variant="warning">Siap Panen</Badge>;
        } else if (item.statusPanen === "DIPANEN") {
            return <Badge variant="info">Dipanen</Badge>;
        } else if (item.statusKesehatan === "SAKIT") {
            return <Badge variant="danger">Sakit</Badge>;
        } else if (item.statusKesehatan === "PERINGATAN") {
            return <Badge variant="default">Peringatan</Badge>;
        } else {
            return <Badge variant="success">Sehat</Badge>;
        }
    };

    const formatDate = (date: Date | string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-foreground/60">Memuat data tanaman...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in pb-20">
            <PageHeader
                title="Kelola Tanaman"
                description="Pantau dan kelola semua tanaman Anda"
                action={
                    <Button
                        onClick={() => router.push("/petani/tanaman/tambah")}
                        className="bg-primary hover:bg-primary/90 text-white font-bold"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Tanaman
                    </Button>
                }
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-4 w-4" />
                        <Input
                            placeholder="Cari tanaman atau lahan..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-card border-border rounded-xl"
                        />
                    </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-card border-border rounded-xl">
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

            {filteredTanaman.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTanaman.map((item) => (
                        <Card key={item.id} className="group hover:border-primary/30 transition-all duration-300">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Wheat className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                                                {item.nama}
                                            </CardTitle>
                                            <p className="text-sm text-foreground/50">
                                                {item.lahan?.nama || "Lahan tidak ditemukan"}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(item)}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-foreground/40" />
                                        <span className="text-foreground/70">
                                            {formatDate(item.tanggalTanam)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-foreground/40" />
                                        <span className="text-foreground/70 truncate">
                                            {item.lahan?.lokasi || "Lokasi tidak tersedia"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/petani/tanaman/${item.id}`)}
                                        className="flex-1 border-border hover:border-primary hover:text-primary rounded-xl"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Lihat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/petani/tanaman/${item.id}/edit`)}
                                        className="flex-1 border-border hover:border-primary hover:text-primary rounded-xl"
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
                <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
                    <Wheat className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground">Tidak Ada Tanaman</h3>
                    <p className="text-foreground/60 max-w-xs mx-auto mt-2">
                        {searchTerm || statusFilter !== "all" 
                            ? "Tidak ada tanaman yang sesuai dengan kriteria pencarian Anda."
                            : "Mulai dengan menambahkan tanaman pertama Anda ke sistem."}
                    </p>
                    {(searchTerm || statusFilter !== "all") && (
                        <Button 
                            variant="ghost" 
                            onClick={() => {setSearchTerm(""); setStatusFilter("all");}}
                            className="mt-4 text-primary"
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}