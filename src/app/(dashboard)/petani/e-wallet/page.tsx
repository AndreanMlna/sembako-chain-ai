"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  Wallet,
  Loader2,
  CreditCard,
  ArrowRightLeft,
  Building2,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Banknote
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatRupiah } from "@/lib/utils";
import { getWallet, getTransaksiHistory } from "@/services/petani.service";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import type { Transaksi } from "@/types";

type ModalType = "topup" | "transfer" | "tarik" | null;

export default function EWalletPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE MODAL & AKSI TRANSAKSI ---
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Top Up
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [topUpMethod, setTopUpMethod] = useState<string>("QRIS");

  // State Form Transfer
  const [transferTarget, setTransferTarget] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferNote, setTransferNote] = useState<string>("");

  // State Form Tarik Dana
  const [withdrawBank, setWithdrawBank] = useState<string>("BCA");
  const [withdrawAccount, setWithdrawAccount] = useState<string>("");
  const [withdrawName, setWithdrawName] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

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

  const closeModal = () => {
    if (isSubmitting) return;
    setActiveModal(null);
    setTopUpAmount("");
    setTransferTarget("");
    setTransferAmount("");
    setTransferNote("");
    setWithdrawAccount("");
    setWithdrawName("");
    setWithdrawAmount("");
  };

  // --- HANDLER SUBMIT TOP UP ---
  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Silakan masukkan nominal top up yang valid");
      return;
    }
    if (amount < 10000) {
      toast.error("Minimal pengisian saldo adalah Rp 10.000");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulasi proses transaksi perbankan / payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalance((prev) => prev + amount);

      const newTx: Transaksi = {
        id: `tx-topup-${Date.now()}`,
        orderId: "",
        tipe: "TOP_UP",
        jumlah: amount,
        status: "BERHASIL",
        referensi: `Top Up Saldo via ${topUpMethod}`,
        pengirimId: session?.user?.id || "system",
        penerimaId: session?.user?.id || "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTransactions((prev) => [newTx, ...prev]);
      toast.success(`Top Up ${formatRupiah(amount)} berhasil! Saldo telah ditambahkan.`);
      closeModal();
    } catch (error) {
      console.error("Top Up error:", error);
      toast.error("Terjadi kendala saat memproses top up");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER SUBMIT TRANSFER ---
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);

    if (!transferTarget.trim()) {
      toast.error("Nomor rekening atau ID penerima wajib diisi");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Silakan masukkan nominal transfer yang valid");
      return;
    }
    if (amount > balance) {
      toast.error("Saldo Anda tidak mencukupi untuk melakukan transfer ini");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalance((prev) => prev - amount);

      const newTx: Transaksi = {
        id: `tx-trf-${Date.now()}`,
        orderId: "",
        tipe: "PEMBAYARAN",
        jumlah: amount,
        status: "BERHASIL",
        referensi: `Transfer ke ${transferTarget} ${transferNote ? `(${transferNote})` : ""}`,
        pengirimId: session?.user?.id || "user",
        penerimaId: transferTarget,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTransactions((prev) => [newTx, ...prev]);
      toast.success(`Transfer ${formatRupiah(amount)} ke ${transferTarget} berhasil!`);
      closeModal();
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Terjadi kendala saat memproses transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER SUBMIT TARIK DANA ---
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!withdrawAccount.trim()) {
      toast.error("Nomor rekening bank tujuan wajib diisi");
      return;
    }
    if (!withdrawName.trim()) {
      toast.error("Nama pemilik rekening tujuan wajib diisi");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Silakan masukkan nominal penarikan yang valid");
      return;
    }
    if (amount < 20000) {
      toast.error("Minimal penarikan dana adalah Rp 20.000");
      return;
    }
    if (amount > balance) {
      toast.error("Saldo Anda tidak mencukupi untuk penarikan dana ini");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalance((prev) => prev - amount);

      const newTx: Transaksi = {
        id: `tx-wd-${Date.now()}`,
        orderId: "",
        tipe: "PENARIKAN",
        jumlah: amount,
        status: "BERHASIL",
        referensi: `Penarikan ke ${withdrawBank} (${withdrawAccount} a.n ${withdrawName})`,
        pengirimId: session?.user?.id || "user",
        penerimaId: "bank-clearing",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTransactions((prev) => [newTx, ...prev]);
      toast.success(`Penarikan ${formatRupiah(amount)} sedang ditransfer ke rekening Anda!`);
      closeModal();
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error("Terjadi kendala saat memproses penarikan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-4 md:px-0" suppressHydrationWarning>
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
              <Button
                onClick={() => setActiveModal("topup")}
                className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-bold border-none shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" /> Top Up
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveModal("transfer")}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm active:scale-95 transition-all"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" /> Transfer
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveModal("tarik")}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm col-span-2 sm:col-span-1 active:scale-95 transition-all"
              >
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
              <p className="text-zinc-500 text-sm max-w-[200px] mt-1">
                Transaksi Anda akan muncul di sini setelah aktivitas dilakukan.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {transactions.map((item) => {
                /**
                 * ANALISIS LOGIKA:
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
                      <div
                        className={`rounded-2xl p-3 transition-transform group-hover:scale-110 ${
                          isMoneyIn
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {isMoneyIn ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-zinc-100 group-hover:text-white">
                          {item.referensi || item.tipe.replace("_", " ")}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isMoneyIn
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-zinc-700 text-zinc-400"
                            }`}
                          >
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
                      <p
                        className={`text-base font-black ${
                          isMoneyIn ? "text-emerald-400" : "text-zinc-100"
                        }`}
                      >
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

      {/* ========================================================================= */}
      {/* --- MODAL 1: TOP UP SALDO --- */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === "topup"}
        onClose={closeModal}
        title="Top Up Saldo E-Wallet"
        className="max-w-lg bg-zinc-950 border border-zinc-800 text-white shadow-2xl"
      >
        <form onSubmit={handleTopUpSubmit} className="space-y-5 pt-2">
          {/* Pilihan Nominal Cepat */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pilih Nominal Cepat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 250000, 500000, 1000000, 2500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt.toString())}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    topUpAmount === amt.toString()
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Input Nominal Manual */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Nominal Top Up (Rp)
            </label>
            <div className="relative">
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Contoh: 100000"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                min="10000"
                step="5000"
                required
              />
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
            <p className="text-[11px] text-zinc-500">Minimal pengisian Rp 10.000</p>
          </div>

          {/* Pilihan Metode Top Up */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "QRIS", name: "QRIS Instan", icon: QrCode },
                { id: "BCA VA", name: "BCA Virtual Account", icon: Building2 },
                { id: "Mandiri VA", name: "Mandiri VA", icon: Building2 },
                { id: "BRI VA", name: "BRI Virtual Account", icon: Building2 },
              ].map((method) => {
                const IconComponent = method.icon;
                const isSelected = topUpMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setTopUpMethod(method.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                    <span className="truncate">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="border-zinc-800 text-zinc-400 hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !topUpAmount}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold border-none shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Konfirmasi Top Up
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* --- MODAL 2: TRANSFER DANA --- */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === "transfer"}
        onClose={closeModal}
        title="Transfer Saldo"
        className="max-w-lg bg-zinc-950 border border-zinc-800 text-white shadow-2xl"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4 pt-2">
          {/* Info Saldo Tersedia */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Saldo Tersedia:</span>
            <span className="text-sm font-bold text-emerald-400">{formatRupiah(balance)}</span>
          </div>

          {/* Penerima */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              ID Dompet / No. Ponsel Penerima
            </label>
            <input
              type="text"
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value)}
              placeholder="Contoh: 08123456789 atau ID-MITRA-09"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
              required
            />
          </div>

          {/* Nominal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Nominal Transfer (Rp)
            </label>
            <div className="relative">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                min="1000"
                required
              />
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          {/* Catatan Transfer */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="Contoh: Pembayaran benih jagung"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl flex items-center gap-2.5 text-xs text-blue-300">
            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-blue-400" />
            <span>Transfer instan tanpa biaya admin sesama pengguna Sembako-Chain.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="border-zinc-800 text-zinc-400 hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !transferTarget || !transferAmount}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold border-none shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4" /> Kirim Sekarang
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* --- MODAL 3: TARIK DANA KE REKENING BANK --- */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === "tarik"}
        onClose={closeModal}
        title="Tarik Saldo ke Rekening Bank"
        className="max-w-lg bg-zinc-950 border border-zinc-800 text-white shadow-2xl"
      >
        <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
          {/* Info Saldo Tersedia */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Saldo Dompet Anda:</span>
            <span className="text-sm font-bold text-emerald-400">{formatRupiah(balance)}</span>
          </div>

          {/* Bank Tujuan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Bank Tujuan
            </label>
            <select
              value={withdrawBank}
              onChange={(e) => setWithdrawBank(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="BCA">Bank Central Asia (BCA)</option>
              <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="BNI">Bank Negara Indonesia (BNI)</option>
              <option value="BSI">Bank Syariah Indonesia (BSI)</option>
            </select>
          </div>

          {/* Nomor Rekening */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Nomor Rekening
            </label>
            <input
              type="text"
              value={withdrawAccount}
              onChange={(e) => setWithdrawAccount(e.target.value)}
              placeholder="Contoh: 1234567890"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
              required
            />
          </div>

          {/* Atas Nama */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              value={withdrawName}
              onChange={(e) => setWithdrawName(e.target.value)}
              placeholder="Sesuai nama di buku tabungan"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
              required
            />
          </div>

          {/* Nominal Tarik */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Nominal Penarikan (Rp)
            </label>
            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Min. 20000"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                min="20000"
                required
              />
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Minimal Rp 20.000</span>
              <button
                type="button"
                onClick={() => setWithdrawAmount(balance.toString())}
                className="text-emerald-400 hover:underline font-bold"
              >
                Tarik Semua
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
              className="border-zinc-800 text-zinc-400 hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !withdrawAccount || !withdrawName || !withdrawAmount}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold border-none shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <ArrowDownLeft className="h-4 w-4" /> Konfirmasi Penarikan
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
