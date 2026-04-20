"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook untuk responsive design - cek media query
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      const listener = () => onStoreChange();

      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Convenience hook: check if mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
