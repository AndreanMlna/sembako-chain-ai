import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

// Komponen Card Utama
export function Card({ children, className }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border shadow-sm transition-all duration-300",
                // Light: Background putih, Dark: Hijau Hutan
                "bg-card text-foreground border-border",
                className
            )}
        >
            {children}
        </div>
    );
}

// Header Card
export function CardHeader({ children, className }: CardProps) {
    return (
        <div className={cn("mb-4 flex items-center justify-between p-6 pb-0", className)}>
            {children}
        </div>
    );
}

// Title Card
export function CardTitle({
                              children,
                              className,
                          }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={cn("text-lg font-semibold text-foreground", className)}>
            {children}
        </h3>
    );
}

// Content Card (Ini yang tadi hilang dan bikin error)
export function CardContent({ children, className }: CardProps) {
    return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// Footer Card
export function CardFooter({ children, className }: CardProps) {
    return (
        <div
            className={cn(
                "mt-4 flex items-center justify-end gap-2 border-t p-6 pt-4 border-border",
                className
            )}
        >
            {children}
        </div>
    );
}