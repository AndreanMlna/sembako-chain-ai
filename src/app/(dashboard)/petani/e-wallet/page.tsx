"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ArrowDownLeft, Plus, History, Wallet, Loader2, CreditCard, ArrowRightLeft } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { getWallet, getTransaksiHistory } from "@/services/petani.service";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react"; // Tambahkan ini
import type { Transaksi } from "@/types";

export default function EWalletPage() {
  const { data: session } = useSession(); // Ambil data session
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [walletRes, transaksiRes] = await Promise.all([
        getWallet(),
        getTransaksiHistory(1)
      ]);

      if (walletRes.success && walletRes.data) {
        setBalance(walletRes.data.saldo);
      }

      if (transaksiRes.success && transaksiRes.data) {
        setTransactions(Array.isArray(transaksiRes.data) ? transaksiRes.data : []);
      }
    } catch (error) {
      console.error("Wallet error:", error);
      toast.error("Gagal menyinkronkan data dompet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchWalletData();
  }, [mounted, fetchWalletData]);

  if (!mounted) return null;

  return (
      <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4 md:px-0">
        <PageHeader
            title="E-Wallet"
            description="Kelola saldo dan transaksi digital hasil panen Anda secara real-time"
        />

        {/* Balance Card Section */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-sembako-darkest to-black p-1 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative z-10 p-6 md:p-10 rounded-[22px] bg-black/40 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-400/80">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">Saldo Dompet Digital</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {isLoading ? (
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    ) : (
                        formatRupiah(balance)
                    )}
                  </h2>
                  <p className="text-emerald-500/50 text-sm font-medium">Terakhir diperbarui: Baru saja</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                <Button className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-bold border-none shadow-lg shadow-emerald-500/20">
                  <Plus className="h-4 w-4 mr-2" /> Top Up
                </Button>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm">
                  <ArrowRightLeft className="h-4 w-4 mr-2" /> Transfer
                </Button>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
                  <ArrowDownLeft className="h-4 w-4 mr-2" /> Tarik Dana
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <Card className="border-none bg-zinc-900/50 backdrop-blur-sm shadow-xl ring-1 ring-white/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <History className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle className="text-lg font-bold text-white">Riwayat Transaksi</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
              Lihat Semua
            </Button>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                  <p className="text-zinc-500 text-sm animate-pulse">Memuat transaksi...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                    <CreditCard className="h-10 w-10 text-zinc-600" />
                  </div>
                  <h3 className="text-white font-semibold">Belum Ada Riwayat</h3>
                  <p className="text-zinc-500 text-sm max-w-[200px] mt-1">Transaksi Anda akan muncul di sini setelah aktivitas dilakukan.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                  {transactions.map((item) => {
                    /** * ANALISIS LOGIKA:
                     * Uang dianggap masuk (+) jika:
                     * 1. Tipe adalah TOP_UP atau REFUND.
                     * 2. User yang login adalah PENERIMA (penerimaId).
                     */
                    const isMoneyIn =
                        item.tipe === "TOP_UP" ||
                        item.tipe === "REFUND" ||
                        item.penerimaId === session?.user?.id;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`rounded-2xl p-3 transition-transform group-hover:scale-110 ${
                                isMoneyIn
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {isMoneyIn ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-zinc-100 group-hover:text-white">
                                {item.referensi || item.tipe.replace('_', ' ')}
                              </p>
                              <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isMoneyIn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-700 text-zinc-400'
                          }`}>
                            {item.tipe}
                          </span>
                                <span className="text-[10px] text-zinc-500">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className={`text-base font-black ${isMoneyIn ? 'text-emerald-400' : 'text-zinc-100'}`}>
                              {isMoneyIn ? "+" : "-"} {formatRupiah(item.jumlah)}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium tracking-wide">BERHASIL</p>
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}