"use client";

import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import EmptyState from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";

export default function KeranjangPage() {
  const { items, getTotalHarga, getTotalItems } = useCartStore();

  return (
    <div>
      <PageHeader
        title="Keranjang Belanja"
        description={`${getTotalItems()} item di keranjang`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="ShoppingCart"
          title="Keranjang kosong"
          description="Tambahkan produk dari katalog untuk mulai belanja."
          actionLabel="Lihat Katalog"
          onAction={() => console.log("Go to katalog")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* TODO: Implement cart items list */}
          </div>
          <div>
            <Card>
              <CardContent>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Ringkasan Belanja
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatRupiah(getTotalHarga())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ongkos Kirim</span>
                    <span className="text-green-600">Dihitung saat checkout</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatRupiah(getTotalHarga())}</span>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full">Checkout</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
