"use client";

import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

export default function EWalletPage() {
  // TODO: Fetch wallet data from API

  return (
    <div>
      <PageHeader title="E-Wallet" description="Kelola saldo dan transaksi digital Anda" />

      {/* Balance Card */}
      <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <CardContent>
          <p className="text-sm text-green-100">Saldo Anda</p>
          <p className="mt-2 text-3xl font-bold">{formatRupiah(2450000)}</p>
          <div className="mt-4 flex gap-3">
            <Button size="sm" className="bg-white text-green-700 hover:bg-green-50">
              <Plus className="h-4 w-4" />
              Top Up
            </Button>
            <Button size="sm" className="border-white bg-transparent text-white hover:bg-green-500">
              <ArrowUpRight className="h-4 w-4" />
              Transfer
            </Button>
            <Button size="sm" className="border-white bg-transparent text-white hover:bg-green-500">
              <ArrowDownLeft className="h-4 w-4" />
              Tarik Dana
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Riwayat Transaksi
          </h3>
          {/* TODO: Implement transaction list */}
          <p className="text-sm text-gray-500">Belum ada transaksi.</p>
        </CardContent>
      </Card>
    </div>
  );
}
