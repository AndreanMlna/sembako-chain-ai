"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsMounted(): boolean {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const mounted = useIsMounted();

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-sembako-primary/10 hover:bg-sembako-primary/20 text-sembako-primary transition-all dark:bg-sembako-light/10 dark:text-sembako-light"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <span>🌙</span>
            ) : (
                <span>☀️</span>
            )}
        </button>
    );
}