"use client";

import { QrCode, Camera } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function ScanQRPage() {
  return (
    <div>
      <PageHeader
        title="Scan QR"
        description="Scan QR code untuk bukti serah terima barang"
      />

      <div className="mx-auto max-w-md">
        <Card>
          <CardContent className="text-center">
            <div className="mx-auto mb-4 flex h-64 w-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <QrCode className="h-16 w-16 text-gray-300" />
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Arahkan kamera ke QR code pada paket untuk konfirmasi pengiriman.
            </p>
            <Button className="w-full">
              <Camera className="h-4 w-4" />
              Buka Scanner
            </Button>
          </CardContent>
        </Card>

        {/* Scan History */}
        <Card className="mt-6">
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Riwayat Scan
            </h3>
            <p className="text-sm text-gray-500">Belum ada riwayat scan.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
