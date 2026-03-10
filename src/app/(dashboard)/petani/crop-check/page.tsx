"use client";

import { Camera, Upload } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";

export default function CropCheckPage() {
  // TODO: Implement camera capture and AI crop check

  return (
    <div>
      <PageHeader
        title="AI Crop Check"
        description="Diagnosa kesehatan tanaman menggunakan kamera AI"
      />

      {/* Upload / Camera Section */}
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <Camera className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            Foto Tanaman Anda
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Ambil foto atau upload gambar tanaman untuk diagnosis AI.
            Sistem akan mendeteksi penyakit dan memberikan solusi instan.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button>
              <Camera className="h-4 w-4" />
              Buka Kamera
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4" />
              Upload Foto
            </Button>
          </div>
        </div>

        {/* TODO: Result section after AI analysis */}
        {/* TODO: History of past crop checks */}
      </div>
    </div>
  );
}
