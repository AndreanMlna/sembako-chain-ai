"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook untuk mendapatkan lokasi pengguna
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(() => {
    const geolocationSupported = typeof navigator !== "undefined" && !!navigator.geolocation;

    return {
      latitude: null,
      longitude: null,
      error: geolocationSupported ? null : "Geolocation tidak didukung oleh browser ini",
      isLoading: geolocationSupported,
    };
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    });
  }, []);

  return state;
}
