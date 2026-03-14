"use client";

import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/cards/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function PetaniDashboard() {
  return (
      <div className="space-y-6">
        <PageHeader
            title="Dashboard Petani"
            description="Ringkasan data lahan, panen, dan penjualan Anda"
        />

        {/* Stats Grid - StatsCard sudah kita fix warnanya tadi */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
              title="Total Lahan"
              value="3 Lahan"
              icon="MapPin"
              trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
              title="Tanaman Aktif"
              value="12"
              icon="Wheat"
              trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
              title="Siap Panen"
              value="5"
              icon="Package"
          />
          <StatsCard
              title="Saldo Wallet"
              value="Rp 2.450.000"
              icon="Wallet"
              trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Sections Area - Ganti <div> bg-white menjadi komponen <Card> */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Panen Mendatang */}
          <Card>
            <CardHeader>
              <CardTitle>Panen Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">
                Daftar tanaman yang akan segera dipanen.
              </p>
              {/* TODO: Implement upcoming harvest list */}
              <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <span className="text-xs text-foreground/40 italic">Belum ada data panen terdekat</span>
              </div>
            </CardContent>
          </Card>

          {/* Aktivitas Terakhir */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/60">
                Riwayat transaksi dan aktivitas terbaru.
              </p>
              {/* TODO: Implement recent activity list */}
              <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                <span className="text-xs text-foreground/40 italic">Belum ada aktivitas terbaru</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}