"use client";

import { useState, useEffect } from "react";

/**
 * Hook untuk responsive design - cek media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Convenience hook: check if mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
