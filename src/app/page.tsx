import Link from "next/link";
import {
  Wheat,
  Store,
  Truck,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-green-50 to-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-green-700">
            Sembako-Chain AI
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Daftar
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Ekosistem Distribusi Pangan
            <br />
            <span className="text-green-600">Hybrid Berbasis AI</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Platform Smart-Supply Chain yang menghubungkan petani, toko, kurir,
            dan konsumen untuk stabilisasi inflasi dan inklusi ekonomi.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="fitur" className="mx-auto max-w-7xl px-6 py-20">
        <h3 className="text-center text-3xl font-bold text-gray-900">
          Satu Platform untuk Semua
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
          Sembako-Chain AI menyatukan seluruh ekosistem distribusi pangan
          dalam satu platform terintegrasi.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Wheat,
              title: "Petani / Agent",
              desc: "AI Crop Check, Dashboard Lahan, Manajemen Panen, E-Wallet digital.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Store,
              title: "Mitra Toko / Pasar",
              desc: "Inventory Management, Auto-Restock Alert, POS sederhana.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Truck,
              title: "Kurir Lokal",
              desc: "AI Route Optimizer, Job Marketplace, Scan QR bukti kirim.",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: ShoppingCart,
              title: "Pembeli (UMKM/Publik)",
              desc: "Katalog stok real-time, Pre-order panen, Tracking logistik.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: BarChart3,
              title: "Regulator (BI/Pemda)",
              desc: "Early Warning Inflasi, Heatmap Stok Pangan, Data Impact Kerja.",
              color: "bg-red-50 text-red-600",
            },
            {
              icon: Zap,
              title: "AI Engine",
              desc: "Computer Vision, Predictive Analytics, Route Optimization.",
              color: "bg-yellow-50 text-yellow-600",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 transition-shadow hover:shadow-md"
            >
              <div className={`inline-flex rounded-lg p-3 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-center text-3xl font-bold text-gray-900">
            Dampak Nyata
          </h3>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                stat: "Stabilisasi Harga",
                desc: "AI memprediksi inflasi dan membantu intervensi pasar tepat sasaran.",
              },
              {
                icon: Users,
                stat: "Lapangan Kerja",
                desc: "Menciptakan Agri-Enumerator, Kurir Independen, dan Digital Shopkeeper.",
              },
              {
                icon: Zap,
                stat: "Efisiensi Rantai Pasok",
                desc: "Memotong tengkulak berlapis, menghubungkan petani langsung ke konsumen.",
              },
            ].map((impact) => (
              <div
                key={impact.stat}
                className="rounded-xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto inline-flex rounded-full bg-green-100 p-4">
                  <impact.icon className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-gray-900">
                  {impact.stat}
                </h4>
                <p className="mt-2 text-sm text-gray-600">{impact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-xl font-bold text-green-700">Sembako-Chain AI</h2>
          <p className="mt-2 text-sm text-gray-500">
            Ekosistem Distribusi Pangan Hybrid Berbasis AI untuk Stabilisasi
            Inflasi dan Inklusi Ekonomi
          </p>
          <p className="mt-4 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Sembako-Chain AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
