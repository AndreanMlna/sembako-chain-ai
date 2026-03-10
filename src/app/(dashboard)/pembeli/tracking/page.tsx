"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function TrackingPage() {
  return (
    <div>
      <PageHeader
        title="Tracking Pengiriman"
        description="Lacak posisi pesanan Anda secara real-time"
      />

      {/* Search Order */}
      <div className="mb-6 flex gap-4">
        <Input placeholder="Masukkan nomor pesanan..." className="flex-1" />
        <Button>Lacak</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardContent className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                {/* TODO: Integrate real-time map tracking */}
                Peta tracking real-time akan ditampilkan di sini.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status */}
        <div>
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Status Pesanan
              </h3>
              <p className="text-sm text-gray-500">
                Masukkan nomor pesanan untuk melihat status.
              </p>
              {/* TODO: Show order timeline/steps */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
