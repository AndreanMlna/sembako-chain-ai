"use client";

import { ArrowUpRight, ArrowDownLeft, Plus, History, Wallet } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

export default function EWalletPage() {
  // Mock data saldo - Nanti ganti dengan fetch API
  const balance = 2450000;

  return (
      <div className="space-y-6">
        <PageHeader title="E-Wallet" description="Kelola saldo dan transaksi digital hasil panen Anda" />

        {/* Balance Card - Dibuat ala Kartu Digital Premium */}
        <div className="relative overflow-hidden rounded-2xl bg-sembako-darkest p-8 text-sembako-accent shadow-xl ring-1 ring-white/10">
          {/* Efek Pola Latar Belakang */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sembako-accent/60">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wider uppercase">Total Saldo Terkini</span>
            </div>

            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
              {formatRupiah(balance)}
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="sm" className="bg-sembako-accent text-sembako-darkest hover:bg-white border-none">
                <Plus className="h-4 w-4" />
                Top Up
              </Button>
              <Button size="sm" variant="outline" className="border-sembako-accent/30 text-sembako-accent hover:bg-white/10">
                <ArrowUpRight className="h-4 w-4" />
                Transfer
              </Button>
              <Button size="sm" variant="outline" className="border-sembako-accent/30 text-sembako-accent hover:bg-white/10">
                <ArrowDownLeft className="h-4 w-4" />
                Tarik Dana
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {/* List Transaksi Placeholder */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/5 p-4">
                <History className="h-8 w-8 text-primary/30" />
              </div>
              <p className="text-sm font-medium text-foreground">Belum ada transaksi</p>
              <p className="text-xs text-foreground/50">Semua aktivitas keuangan akan tercatat di sini.</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}