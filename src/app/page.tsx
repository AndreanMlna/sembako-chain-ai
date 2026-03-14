"use client"; // Tambahkan ini agar aman dengan ThemeProvider

import Link from "next/link";
import {
  Wheat, Store, Truck, ShoppingCart, BarChart3,
  ArrowRight, Shield, Zap, Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // Pasang toggle juga di sini!

export default function HomePage() {
  return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Hero Section */}
        <header className="bg-gradient-to-b from-primary/10 to-background border-b border-border/50">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-primary tracking-tighter">
              Sembako-Chain AI
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                  href="/login"
                  className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
              >
                Masuk
              </Link>
              <Link
                  href="/register"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-accent hover:opacity-90 transition-all shadow-md shadow-primary/20"
              >
                Daftar
              </Link>
            </div>
          </nav>

          <div className="mx-auto max-w-7xl px-6 py-24 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              Ekosistem Distribusi Pangan
              <br />
              <span className="text-primary italic">Hybrid Berbasis AI</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-foreground/60 leading-relaxed">
              Platform Smart-Supply Chain yang menghubungkan petani, toko, kurir,
              dan konsumen untuk stabilisasi inflasi dan inklusi ekonomi.
            </p>
            <div className="mt-12 flex justify-center gap-4">
              <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-accent hover:scale-105 transition-all shadow-lg shadow-primary/25"
              >
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                  href="#fitur"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-sm font-bold text-foreground hover:bg-foreground/5 transition-all"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section id="fitur" className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Satu Platform untuk Semua
            </h3>
            <p className="mx-auto max-w-2xl text-foreground/50">
              Sembako-Chain AI menyatukan seluruh ekosistem distribusi pangan
              dalam satu platform terintegrasi.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Wheat, title: "Petani / Agent", desc: "AI Crop Check, Dashboard Lahan, Manajemen Panen, E-Wallet digital.", color: "bg-primary/10 text-primary" },
              { icon: Store, title: "Mitra Toko / Pasar", desc: "Inventory Management, Auto-Restock Alert, POS sederhana.", color: "bg-blue-500/10 text-blue-500" },
              { icon: Truck, title: "Kurir Lokal", desc: "AI Route Optimizer, Job Marketplace, Scan QR bukti kirim.", color: "bg-purple-500/10 text-purple-500" },
              { icon: ShoppingCart, title: "Pembeli (UMKM/Publik)", desc: "Katalog stok real-time, Pre-order panen, Tracking logistik.", color: "bg-orange-500/10 text-orange-500" },
              { icon: BarChart3, title: "Regulator (BI/Pemda)", desc: "Early Warning Inflasi, Heatmap Stok Pangan, Data Impact Kerja.", color: "bg-red-500/10 text-red-500" },
              { icon: Zap, title: "AI Engine", desc: "Computer Vision, Predictive Analytics, Route Optimization.", color: "bg-yellow-500/10 text-yellow-500" },
            ].map((feature) => (
                <div key={feature.title} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                  <div className={`inline-flex rounded-xl p-4 transition-transform group-hover:scale-110 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-6 text-xl font-bold text-foreground">{feature.title}</h4>
                  <p className="mt-3 text-sm text-foreground/50 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-primary/5 border-y border-primary/10 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="text-center text-3xl font-extrabold text-foreground">Dampak Nyata</h3>
            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {[
                { icon: Shield, stat: "Stabilisasi Harga", desc: "AI memprediksi inflasi dan membantu intervensi pasar tepat sasaran." },
                { icon: Users, stat: "Lapangan Kerja", desc: "Menciptakan Agri-Enumerator, Kurir Independen, dan Digital Shopkeeper." },
                { icon: Zap, stat: "Efisiensi Rantai Pasok", desc: "Memotong tengkulak berlapis, menghubungkan petani langsung ke konsumen." },
              ].map((impact) => (
                  <div key={impact.stat} className="flex flex-col items-center text-center p-4">
                    <div className="inline-flex rounded-2xl bg-card border border-primary/20 p-5 shadow-inner">
                      <impact.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="mt-6 text-2xl font-bold text-foreground tracking-tight">{impact.stat}</h4>
                    <p className="mt-3 text-sm text-foreground/50 leading-relaxed">{impact.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-16">
          <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
            <h2 className="text-2xl font-bold text-primary tracking-tighter">Sembako-Chain AI</h2>
            <p className="mx-auto max-w-md text-sm text-foreground/40 leading-relaxed">
              Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi
              Inflasi dan Inklusi Ekonomi
            </p>
            <div className="pt-8 border-t border-border/50 text-xs text-foreground/30 font-medium">
              &copy; {new Date().getFullYear()} Sembako-Chain AI. Dibuat dengan ❤️ untuk Indonesia.
            </div>
          </div>
        </footer>
      </div>
  );
}