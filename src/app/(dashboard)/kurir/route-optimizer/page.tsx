"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

export default function RouteOptimizerPage() {
  return (
    <div>
      <PageHeader
        title="AI Route Optimizer"
        description="Rute pengiriman multi-drop yang dioptimasi AI untuk efisiensi maksimal"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardContent className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                {/* TODO: Integrate map (Mapbox/Google Maps/Leaflet) */}
                Peta rute akan ditampilkan di sini.
                <br />
                AI akan menghitung rute multi-drop optimal.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        <div>
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Detail Rute
              </h3>
              <p className="text-sm text-gray-500">
                Pilih job aktif untuk melihat rute optimal.
              </p>
              {/* TODO: Show waypoints, distance, estimated time */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
