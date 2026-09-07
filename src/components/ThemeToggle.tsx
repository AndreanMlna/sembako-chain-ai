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

    if (!mounted) {
        return <div className="w-10 h-10 rounded-lg bg-primary/5" suppressHydrationWarning />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all"
            aria-label="Toggle Theme"
            suppressHydrationWarning
        >
            {theme === "dark" ? (
                <span>🌙</span>
            ) : (
                <span>☀️</span>
            )}
        </button>
    );
}
