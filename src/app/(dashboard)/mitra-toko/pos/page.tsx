"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/shared/SearchBar";

export default function POSPage() {
  return (
    <div>
      <PageHeader
        title="Point of Sale (POS)"
        description="Kasir sederhana untuk transaksi di toko"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <SearchBar
            placeholder="Scan barcode atau cari produk..."
            onSearch={(q) => console.log("Search:", q)}
          />
          <div className="mt-4">
            {/* TODO: Implement product grid for POS selection */}
            <p className="py-12 text-center text-sm text-gray-500">
              Cari produk untuk menambahkan ke transaksi.
            </p>
          </div>
        </div>

        {/* Cart / Checkout */}
        <div>
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Keranjang Belanja
              </h3>
              <p className="text-sm text-gray-500">Belum ada item.</p>
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rp 0</span>
                </div>
                <Button className="mt-4 w-full" disabled>
                  Bayar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
